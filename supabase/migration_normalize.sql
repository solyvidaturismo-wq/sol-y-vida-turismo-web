-- ============================================================
-- MIGRACION: Normalizar esquema Sol y Vida Turismo
-- Ejecutar en Supabase SQL Editor (en orden)
-- ============================================================

-- ============================================================
-- 1. TABLA: tags (etiquetas de perfil/audiencia)
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id          TEXT PRIMARY KEY,           -- ej: 'parejas', 'aventura', 'nivel_bajo'
  label       TEXT NOT NULL,              -- ej: 'Parejas', 'Aventura'
  emoji       TEXT DEFAULT '',
  group_id    TEXT NOT NULL,              -- ej: 'tipo_grupo', 'interes', 'nivel_fisico'
  group_label TEXT NOT NULL,              -- ej: 'Tipo de Grupo', 'Interés Principal'
  group_color TEXT DEFAULT 'sky',         -- ej: 'sky', 'violet', 'amber'
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Insertar todas las etiquetas de perfil
INSERT INTO tags (id, label, emoji, group_id, group_label, group_color) VALUES
  -- Tipo de Grupo
  ('parejas',      'Parejas',            '💑', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('familiar',     'Familiar',           '👨‍👩‍👧‍👦', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('amigos',       'Amigos',             '🤝', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('corporativo',  'Corporativo',        '💼', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('solo',         'Solo / Mochilero',   '🎒', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('luna_de_miel', 'Luna de Miel',       '💍', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  ('escolar',      'Escolar / Colegios', '🎓', 'tipo_grupo',   'Tipo de Grupo',      'sky'),
  -- Rango de Edad
  ('ninos',           'Niños (6-12)',         '👦', 'rango_edad',  'Rango de Edad',      'violet'),
  ('adolescentes',    'Adolescentes (13-17)', '🧑', 'rango_edad',  'Rango de Edad',      'violet'),
  ('jovenes',         'Jóvenes (18-30)',      '🧑‍🦱', 'rango_edad',  'Rango de Edad',      'violet'),
  ('adultos',         'Adultos (30-60)',      '🧔', 'rango_edad',  'Rango de Edad',      'violet'),
  ('adultos_mayores', 'Adultos Mayores (60+)','👴', 'rango_edad',  'Rango de Edad',      'violet'),
  ('todas_edades',    'Todas las Edades',     '🌈', 'rango_edad',  'Rango de Edad',      'violet'),
  -- Interés Principal
  ('aventura',     'Aventura',         '⚡', 'interes',      'Interés Principal',  'amber'),
  ('relax',        'Relax / Descanso', '🧘', 'interes',      'Interés Principal',  'amber'),
  ('cultural',     'Cultural',         '🏛️', 'interes',      'Interés Principal',  'amber'),
  ('gastronomico', 'Gastronómico',     '🍽️', 'interes',      'Interés Principal',  'amber'),
  ('fotografico',  'Fotográfico',      '📸', 'interes',      'Interés Principal',  'amber'),
  ('religioso',    'Religioso',        '⛪', 'interes',      'Interés Principal',  'amber'),
  ('naturaleza',   'Naturaleza',       '🌿', 'interes',      'Interés Principal',  'amber'),
  ('deportivo',    'Deportivo',        '🏃', 'interes',      'Interés Principal',  'amber'),
  -- Nivel Físico
  ('nivel_bajo',     'Bajo',     '🟢', 'nivel_fisico',  'Nivel Físico',       'emerald'),
  ('nivel_moderado', 'Moderado', '🟡', 'nivel_fisico',  'Nivel Físico',       'emerald'),
  ('nivel_alto',     'Alto',     '🟠', 'nivel_fisico',  'Nivel Físico',       'emerald'),
  ('nivel_extremo',  'Extremo',  '🔴', 'nivel_fisico',  'Nivel Físico',       'emerald'),
  -- Presupuesto
  ('economico', 'Económico', '💲', 'presupuesto',  'Presupuesto',        'rose'),
  ('medio',     'Medio',     '💵', 'presupuesto',  'Presupuesto',        'rose'),
  ('premium',   'Premium',   '💎', 'presupuesto',  'Presupuesto',        'rose')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. TABLA: product_tags (pivote productos <-> etiquetas)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag     ON product_tags(tag_id);

-- ============================================================
-- 3. TABLA: route_items (items del itinerario normalizados)
-- ============================================================
CREATE TABLE IF NOT EXISTS route_items (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  route_id          UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  day               INTEGER NOT NULL DEFAULT 1,
  item_order        INTEGER NOT NULL DEFAULT 0,
  time_start        TEXT,             -- "09:00"
  time_end          TEXT,             -- "12:00"
  notes             TEXT DEFAULT '',
  is_optional       BOOLEAN DEFAULT false,
  included_in_price BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_route_items_route   ON route_items(route_id);
CREATE INDEX IF NOT EXISTS idx_route_items_product ON route_items(product_id);

-- ============================================================
-- 4. MIGRAR datos existentes (JSON -> tablas nuevas)
-- ============================================================

-- 4a. Migrar profile_tags de products.custom_fields a product_tags
-- (solo si hay productos con profile_tags en custom_fields)
INSERT INTO product_tags (product_id, tag_id)
SELECT
  p.id,
  jsonb_array_elements_text(p.custom_fields->'profile_tags') AS tag_id
FROM products p
WHERE p.custom_fields ? 'profile_tags'
  AND jsonb_array_length(p.custom_fields->'profile_tags') > 0
ON CONFLICT DO NOTHING;

-- 4b. Migrar itinerary JSON de routes a route_items
INSERT INTO route_items (route_id, product_id, day, item_order, time_start, time_end, notes, is_optional, included_in_price)
SELECT
  r.id,
  CASE
    WHEN item->>'ref_type' = 'product' AND item->>'ref_id' IS NOT NULL
    THEN (item->>'ref_id')::uuid
    ELSE NULL
  END,
  COALESCE((item->>'day')::int, 1),
  COALESCE((item->>'order')::int, 0),
  item->>'time_start',
  item->>'time_end',
  COALESCE(item->>'notes', ''),
  COALESCE((item->>'is_optional')::boolean, false),
  COALESCE((item->>'included_in_price')::boolean, true)
FROM routes r,
     jsonb_array_elements(r.itinerary) AS item
WHERE jsonb_array_length(r.itinerary) > 0
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. RLS (Row Level Security) - politicas basicas
-- ============================================================

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_items ENABLE ROW LEVEL SECURITY;

-- Permitir lectura publica (anon + authenticated)
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Product tags are viewable by everyone"
  ON product_tags FOR SELECT USING (true);

CREATE POLICY "Route items are viewable by everyone"
  ON route_items FOR SELECT USING (true);

-- Permitir escritura a usuarios autenticados
CREATE POLICY "Authenticated users can manage product_tags"
  ON product_tags FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage route_items"
  ON route_items FOR ALL USING (auth.role() = 'authenticated');

-- Si aun no tienes auth configurado, usa estas politicas temporales:
-- (descomenta estas y comenta las de arriba)
-- CREATE POLICY "Allow all product_tags" ON product_tags FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all route_items" ON route_items FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- NOTA: Despues de verificar que la migracion funciono,
-- puedes limpiar las columnas JSON viejas:
--
-- ALTER TABLE routes DROP COLUMN IF EXISTS itinerary;
-- (No borrar custom_fields de products porque tiene otros datos)
-- ============================================================
