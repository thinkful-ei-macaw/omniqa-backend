alter table answer_upvotes 
  drop constraint answer_upvotes_answer_id_fkey, 
  add constraint answer_upvotes_answer_id_fkey foreign key (answer_id) references answers(id) on delete cascade;