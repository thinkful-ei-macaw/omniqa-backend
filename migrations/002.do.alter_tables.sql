ALTER TABLE answer_upvotes ADD CONSTRAINT upvote_once UNIQUE (user_id, answer_id);
ALTER TABLE question_likes ADD CONSTRAINT like_once UNIQUE (user_id, question_id);
