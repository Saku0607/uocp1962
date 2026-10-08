create table if not exists public.welcome_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    event_date date,
    location text,
    body text not null,
    details_url text,
    created_at timestamptz not null default now()
);

create table if not exists public.site_admins (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.welcome_posts enable row level security;
alter table public.site_admins enable row level security;

revoke insert, update, delete on public.welcome_posts from anon, authenticated;
grant select on public.welcome_posts to anon, authenticated;
grant insert, update, delete on public.welcome_posts to authenticated;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

do $$
declare
    policy_row record;
begin
    for policy_row in
        select schemaname, tablename, policyname
        from pg_policies
        where schemaname = 'public'
          and tablename = 'welcome_posts'
    loop
        execute format('drop policy %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
    end loop;
end
$$;

drop policy if exists "site_admins_select_self" on public.site_admins;
create policy "site_admins_select_self"
on public.site_admins
for select
to authenticated
using (user_id = auth.uid());

create policy "welcome_posts_public_read"
on public.welcome_posts
for select
to anon, authenticated
using (true);

create policy "welcome_posts_admin_insert"
on public.welcome_posts
for insert
to authenticated
with check (exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "welcome_posts_admin_update"
on public.welcome_posts
for update
to authenticated
using (exists (select 1 from public.site_admins where user_id = auth.uid()))
with check (exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "welcome_posts_admin_delete"
on public.welcome_posts
for delete
to authenticated
using (exists (select 1 from public.site_admins where user_id = auth.uid()));
