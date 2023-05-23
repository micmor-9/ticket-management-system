INSERT INTO public.customer (email, name, surname) VALUES ('user2@example.com', 'user2', 'gal');
INSERT INTO public.customer (email, name, surname) VALUES ('user1@example.com', 'user1', 'rossi');

INSERT INTO public.expert (id, email, name, surname, specialization) VALUES ('123', 'expert1@example.com', 'Mario', 'Rossi', 'battery');
INSERT INTO public.expert (id, email, name, surname, specialization) VALUES ('1', 'expert2@example.com', 'Michele', 'Morgigno', 'display');

INSERT INTO public.product (id, name) VALUES ('10', 'iphone');
INSERT INTO public.product (id, name) VALUES ('11', 'ipad');
INSERT INTO public.product (id, name) VALUES ('12', 'mac');

INSERT INTO public.orders (id, date, warranty_duration, customer_email, product_id) VALUES (1, '2022-05-16 16:19:09.000000', '2024-05-16 16:19:18.000000', 'user2@example.com', '10');
INSERT INTO public.orders (id, date, warranty_duration, customer_email, product_id) VALUES (2, '2023-03-16 17:51:30.000000', '2025-05-16 17:51:36.000000', 'user1@example.com', '11');
INSERT INTO public.orders (id, date, warranty_duration, customer_email, product_id) VALUES (3, '2023-02-16 18:07:21.000000', '2027-05-16 18:07:26.000000', 'user2@example.com', '12');

INSERT INTO public.ticket (id, creation_timestamp, issue_description, priority, status, customer_email, expert_id, product_id) VALUES (1, '2023-05-16 16:19:55.000000', 'batteria rovinata', 'LOW', 'OPEN', 'user2@example.com', '123', '10');
INSERT INTO public.ticket (id, creation_timestamp, issue_description, priority, status, customer_email, expert_id, product_id) VALUES (2, '2023-05-06 17:50:41.000000', 'schermo rotto', 'LOW', 'RESOLVED', 'user1@example.com', '123', '11');
INSERT INTO public.ticket (id, creation_timestamp, issue_description, priority, status, customer_email, expert_id, product_id) VALUES (52, '2023-05-16 18:11:07.182000', 'cuffie', 'LOW', 'IN_PROGRESS', 'user2@example.com', '123', '12');

INSERT INTO public.ticket_status (id, description, status, status_timestamp, expert_id, ticket_id) VALUES (53, 'caricatore rotto', 'IN_PROGRESS', '2023-05-16 18:14:59.391000', '123', 52);
INSERT INTO public.ticket_status (id, description, status, status_timestamp, expert_id, ticket_id) VALUES (102, 'schermo rotto', 'IN_PROGRESS', '2023-05-16 18:17:26.554000', '123', 2);
INSERT INTO public.ticket_status (id, description, status, status_timestamp, expert_id, ticket_id) VALUES (103, 'schermo rotto', 'RESOLVED', '2023-05-16 18:17:40.716000', '123', 2);

INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (1, 'ciao come va', '2023-05-19 13:25:55.947000', 'Mario', 52);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (2, 'io tutto bene, tu?', '2023-05-19 13:29:16.922000', 'Michele', 52);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (55, 'io tutto bene, tu?', '2023-05-19 13:40:04.488000', 'Michele', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (102, 'io tutto bene, tu?', '2023-05-19 13:42:18.253000', 'user1', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (202, 'io tutto bene, tu?', '2023-05-19 13:47:32.767000', 'user1', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (252, 'io tutto bene, tu?', '2023-05-19 13:58:51.807000', 'Mario', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (302, 'io tutto bene, tu?', '2023-05-19 14:06:28.391000', 'claudio', 2);
