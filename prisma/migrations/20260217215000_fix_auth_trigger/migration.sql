-- Update the function to include updated_at
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, tenant_id, updated_at)
  values (new.id, new.email, new.id::text, now());
  return new;
end;
$$;
