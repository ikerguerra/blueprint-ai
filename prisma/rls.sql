-- Enable RLS
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "document_chunks" ENABLE ROW LEVEL SECURITY;

-- Note: We assume auth.uid() function is available in Supabase environment.
-- If running locally without Supabase Auth mock, ensure auth schema exists or mock the function.

-- Policy helper function to get current user's tenant_id safely
-- We use SECURITY DEFINER to bypass RLS on users table for this lookup
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS text AS $$
DECLARE
  tenant text;
BEGIN
  SELECT tenant_id INTO tenant FROM public.users WHERE id = auth.uid()::uuid;
  RETURN tenant;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users Policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON "users"
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON "users"
  FOR UPDATE USING (id = auth.uid()::uuid);

-- Documents Policies
-- Users can view documents belonging to their tenant
CREATE POLICY "Users can view tenant documents" ON "documents"
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can insert tenant documents" ON "documents"
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update tenant documents" ON "documents"
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can delete tenant documents" ON "documents"
  FOR DELETE USING (tenant_id = get_current_tenant_id());

-- Document Chunks Policies
CREATE POLICY "Users can view tenant chunks" ON "document_chunks"
  FOR SELECT USING (tenant_id = get_current_tenant_id());
  
CREATE POLICY "Users can insert tenant chunks" ON "document_chunks"
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());
  
CREATE POLICY "Users can update tenant chunks" ON "document_chunks"
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can delete tenant chunks" ON "document_chunks"
  FOR DELETE USING (tenant_id = get_current_tenant_id());
