TRUNCATE
  users, departments, questions
  RESTART IDENTITY CASCADE;

INSERT INTO users (name, username, password)
VALUES 
  ('Connor', 'ConnorOmni', '$2a$12$ok8Ff1rVNPCrsGixA6cTxeNGWsbq.dEa0LeJcKdCLSM3.gc.0ct3iASDFasdf12!@')
;

INSERT INTO departments (name)
VALUES 
  ('HR'),
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Engineering')
;

INSERT INTO questions (author, question_body, department, answered)
VALUES 
  (1, 'test question 1', 1, false),
  (1, 'test question 2', 2, false),
  (1, 'test question 3', 3, false),
  (1, 'test question 4', 4, false),
  (1, 'test question 5', 5, true)
;