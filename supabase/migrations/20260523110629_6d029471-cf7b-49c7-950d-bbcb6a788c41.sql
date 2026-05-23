
-- Roles enum + table (separate from profiles to avoid privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- CATEGORIES
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER blog_categories_updated BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AUTHORS
CREATE TABLE public.blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role TEXT,
  bio TEXT,
  avatar_url TEXT,
  credentials TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER blog_authors_updated BEFORE UPDATE ON public.blog_authors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- POSTS
CREATE TYPE public.post_status AS ENUM ('draft','published','archived');

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  direct_answer TEXT,
  content TEXT NOT NULL DEFAULT '',
  featured_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
  reviewer_name TEXT,
  reviewer_credentials TEXT,
  meta_title TEXT,
  meta_description TEXT,
  primary_keyword TEXT,
  secondary_keywords TEXT[],
  status public.post_status NOT NULL DEFAULT 'draft',
  reading_time INTEGER,
  canonical_url TEXT,
  cta_label TEXT,
  cta_url TEXT,
  geo_entities TEXT[],
  geo_questions TEXT[],
  geo_services TEXT[],
  geo_locality TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_status ON public.blog_posts(status);
CREATE INDEX idx_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_posts_category ON public.blog_posts(category_id);
CREATE TRIGGER blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQS
CREATE TABLE public.blog_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_faqs_post ON public.blog_faqs(post_id);

-- RELATED
CREATE TABLE public.blog_related_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  related_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, related_post_id)
);

-- SEO SETTINGS (per-page overrides)
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  schema_json JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER seo_settings_updated BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS ENABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_related_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- profiles: users see/update own; staff see all
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- user_roles: user can see own; admin manages all
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Categories: public read, staff write
CREATE POLICY "categories_public_read" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "categories_staff_write" ON public.blog_categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Authors: public read, staff write
CREATE POLICY "authors_public_read" ON public.blog_authors FOR SELECT USING (true);
CREATE POLICY "authors_staff_write" ON public.blog_authors FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Posts: public reads published; staff reads/writes all
CREATE POLICY "posts_public_read_published" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_staff_read_all" ON public.blog_posts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "posts_staff_write" ON public.blog_posts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- FAQs: public read if parent post published, staff write
CREATE POLICY "faqs_public_read" ON public.blog_faqs FOR SELECT USING (EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = post_id AND p.status = 'published'));
CREATE POLICY "faqs_staff_all" ON public.blog_faqs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "related_public_read" ON public.blog_related_posts FOR SELECT USING (true);
CREATE POLICY "related_staff_all" ON public.blog_related_posts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- SEO settings: public read, staff write
CREATE POLICY "seo_public_read" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "seo_staff_write" ON public.seo_settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images','blog-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "blog_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "blog_images_staff_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images' AND public.is_staff(auth.uid()));
CREATE POLICY "blog_images_staff_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blog-images' AND public.is_staff(auth.uid()));
CREATE POLICY "blog_images_staff_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog-images' AND public.is_staff(auth.uid()));
