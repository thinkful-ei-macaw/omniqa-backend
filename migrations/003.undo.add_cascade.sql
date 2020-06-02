alter table question_likes 
  drop constraint question_likes_question_id_fkey, 
  add constraint question_likes_question_id_fkey foreign key (question_id) references questions(id);

alter table answers 
  drop constraint answers_question_fkey, 
  add constraint answers_question_fkey foreign key (question) references questions(id);