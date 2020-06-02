ALTER TABLE answer_upvotes
  DROP CONSTRAINT IF EXISTS upvote_once;
ALTER TABLE question_likes
  DROP CONSTRAINT IF EXISTS like_once;