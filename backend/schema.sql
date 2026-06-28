CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cookies', 'cupcakes', 'cakes', 'pastries', 'other')),
  image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'bank' CHECK (payment_method IN ('bank')),
  transaction_id TEXT DEFAULT '',
  items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  special_instructions TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_charges NUMERIC DEFAULT 50,
  bank_name TEXT DEFAULT '',
  account_title TEXT DEFAULT '',
  account_number TEXT DEFAULT '',
  iban TEXT DEFAULT '',
  branch_code TEXT DEFAULT '',
  bank_instructions TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (delivery_charges) VALUES (50) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT DEFAULT '',
  category TEXT DEFAULT 'other',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage policies for gallery bucket
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Allow all inserts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow all deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery');
