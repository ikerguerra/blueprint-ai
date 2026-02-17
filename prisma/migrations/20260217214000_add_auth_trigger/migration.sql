-- Create a function that inserts a row into public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, tenant_id)
  values (new.id, new.email, new.id::text);
  return new;
end;
$$;

-- Create a trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
