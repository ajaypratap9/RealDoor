-- Schema for RealDoor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Households
create table if not exists households (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  metro text not null,
  program text not null default 'LIHTC',
  household_size integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  storage_path text not null,
  doc_type text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending_review'
);

-- Extracted Fields
create table if not exists extracted_fields (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade not null,
  field_name text not null,
  value text,
  confidence text not null,
  source_snippet text,
  confirmed boolean default false,
  corrected boolean default false
);

-- Calculations
create table if not exists calculations (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  rule_id text not null,
  formula text not null,
  computed_value numeric not null,
  threshold numeric not null,
  result text not null,
  effective_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Checklist Items
create table if not exists checklist_items (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  item_name text not null,
  status text not null default 'missing',
  linked_document_id uuid references documents(id) on delete set null
);

-- QA History
create table if not exists qa_history (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  question text not null,
  answer text,
  citation jsonb,
  evidence_type text not null,
  is_no_call boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Consent Log
create table if not exists consent_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Packets
create table if not exists packets (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  storage_path text not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies
alter table households enable row level security;
alter table documents enable row level security;
alter table extracted_fields enable row level security;
alter table calculations enable row level security;
alter table checklist_items enable row level security;
alter table qa_history enable row level security;
alter table consent_log enable row level security;
alter table packets enable row level security;

-- Households policy
create policy "Users can view their own household" on households
  for select using (auth.uid() = user_id);
create policy "Users can insert their own household" on households
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own household" on households
  for update using (auth.uid() = user_id);

-- Documents policy (join on household)
create policy "Users can view their household's documents" on documents
  for select using (
    household_id in (select id from households where user_id = auth.uid())
  );
create policy "Users can insert household's documents" on documents
  for insert with check (
    household_id in (select id from households where user_id = auth.uid())
  );
create policy "Users can delete household's documents" on documents
  for delete using (
    household_id in (select id from households where user_id = auth.uid())
  );

-- Repeat pattern for other tables (Extracted Fields, Calculations, Checklist Items, QA History, Packets)
create policy "Users access via household join" on extracted_fields
  for all using ( document_id in (select id from documents where household_id in (select id from households where user_id = auth.uid())) );

create policy "Users access calculations via household join" on calculations
  for all using ( household_id in (select id from households where user_id = auth.uid()) );

create policy "Users access checklist via household join" on checklist_items
  for all using ( household_id in (select id from households where user_id = auth.uid()) );

create policy "Users access qa_history via household join" on qa_history
  for all using ( household_id in (select id from households where user_id = auth.uid()) );

create policy "Users access packets via household join" on packets
  for all using ( household_id in (select id from households where user_id = auth.uid()) );

-- Consent Log policy
create policy "Users can view and insert their own consent logs" on consent_log
  for all using (auth.uid() = user_id);
