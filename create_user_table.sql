-- Create the user table
create table if not exists public.user (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Function to insert into the user table on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run the function after signup
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
