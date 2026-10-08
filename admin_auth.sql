create table if not exists public.site_admins (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

drop policy if exists "site_admins_select_self" on public.site_admins;
create policy "site_admins_select_self"
on public.site_admins
for select
to authenticated
using (user_id = auth.uid());

do $$
declare
    policy_row record;
begin
    for policy_row in
        select schemaname, tablename, policyname
        from pg_policies
        where schemaname = 'public'
          and tablename in ('activity_reports', 'welcome_posts')
    loop
        execute format('drop policy %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
    end loop;
end
$$;

alter table public.activity_reports enable row level security;
alter table public.welcome_posts enable row level security;

revoke insert, update, delete on public.activity_reports, public.welcome_posts from anon, authenticated;
grant select on public.activity_reports, public.welcome_posts to anon, authenticated;
grant insert, update, delete on public.activity_reports, public.welcome_posts to authenticated;

create policy "activity_reports_public_read"
on public.activity_reports
for select
to anon, authenticated
using (true);

create policy "activity_reports_admin_insert"
on public.activity_reports
for insert
to authenticated
with check (exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "activity_reports_admin_update"
on public.activity_reports
for update
to authenticated
using (exists (select 1 from public.site_admins where user_id = auth.uid()))
with check (exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "activity_reports_admin_delete"
on public.activity_reports
for delete
to authenticated
using (exists (select 1 from public.site_admins where user_id = auth.uid()));

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

do $$
declare
    policy_row record;
begin
    for policy_row in
        select policyname
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and (coalesce(qual, '') || ' ' || coalesce(with_check, '')) ilike '%activity-images%'
    loop
        execute format('drop policy %I on storage.objects', policy_row.policyname);
    end loop;
end
$$;

create policy "activity_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'activity-images');

create policy "activity_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'activity-images' and exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "activity_images_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'activity-images' and exists (select 1 from public.site_admins where user_id = auth.uid()))
with check (bucket_id = 'activity-images' and exists (select 1 from public.site_admins where user_id = auth.uid()));

create policy "activity_images_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'activity-images' and exists (select 1 from public.site_admins where user_id = auth.uid()));
