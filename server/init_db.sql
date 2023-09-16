INSERT INTO public.customer (email, name, surname) VALUES ('user2@example.com', 'user2', 'gal');
INSERT INTO public.customer (email, name, surname) VALUES ('user1@example.com', 'user1', 'rossi');

INSERT INTO public.expert (id, email, name, surname, specialization) VALUES ('123', 'expert1@example.com', 'Mario', 'Rossi', 'battery');
INSERT INTO public.expert (id, email, name, surname, specialization) VALUES ('1', 'expert2@example.com', 'Michele', 'Morgigno', 'display');

INSERT INTO public.manager (id, email, name, surname, managed_area) VALUES ('1', 'manager1@example.com', 'Giovanni', 'Malnati', 'battery');

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

INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (19, 'ciao come va', '2023-05-19 13:25:55.947000', 'Mario', 52);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (20, 'io tutto bene, tu?', '2023-05-19 13:29:16.922000', 'Michele', 52);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (21, 'io tutto bene, tu?', '2023-05-19 13:40:04.488000', 'Michele', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (22, 'io tutto bene, tu?', '2023-05-19 13:42:18.253000', 'user1', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (23, 'io tutto bene, tu?', '2023-05-19 13:47:32.767000', 'user1', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (24, 'io tutto bene, tu?', '2023-05-19 13:58:51.807000', 'Mario', 2);
INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id) VALUES (25, 'io tutto bene, tu?', '2023-05-19 14:06:28.391000', 'claudio', 2);

INSERT INTO public.message (id, message_text, message_timestamp, sender, ticket_id)
VALUES
    (1, 'Ciao! Ho bisogno di assistenza con il mio prodotto.', '2023-07-22 08:00:00', 'customer', 1),
    (2, 'Certo, sono qui per aiutarti! Di che cosa hai bisogno?', '2023-07-22 08:10:00', 'expert', 1),
    (3, 'Ho un problema con la connessione Wi-Fi. Non riesco a connettermi.', '2023-07-22 08:20:00', 'customer', 1),
    (4, 'Capisco la tua preoccupazione. Proveremo a risolverlo insieme.', '2023-07-22 08:30:00', 'expert', 1),
    (5, 'Grazie mille! Non so cosa farei senza internet.', '2023-07-22 08:40:00', 'customer', 1),
    (6, 'Nessun problema, siamo qui per assicurarci che tutto funzioni correttamente.', '2023-07-22 08:50:00', 'expert', 1),
    (7, 'Sto verificando le impostazioni del router. Potresti provare a riavviare il dispositivo?', '2023-07-22 09:00:00', 'expert', 1),
    (8, 'Ok, ho riavviato il router ma ancora non si connette.', '2023-07-22 09:10:00', 'customer', 1),
    (9, 'Hai provato a verificare la password Wi-Fi? Potrebbe essere sbagliata.', '2023-07-22 09:20:00', 'expert', 1),
    (10, 'Hai ragione, la password era errata. Ora funziona! Grazie mille!', '2023-07-22 09:30:00', 'customer', 1),
    (11, 'Felice di aver risolto il problema! Se hai altre domande, non esitare a chiedere.', '2023-07-22 09:40:00', 'expert', 1),
    (12, 'Certamente, ti contatterò se ho bisogno di ulteriore assistenza. Grazie ancora!', '2023-07-22 09:50:00', 'customer', 1),
    (13, 'Di nulla! Siamo sempre qui per aiutarti. Buona giornata!', '2023-07-22 10:00:00', 'expert', 1),
    (14, 'Grazie, altrettanto! Arrivederci!', '2023-07-22 10:10:00', 'customer', 1),
    (15, 'Arrivederci! Non esitare a tornare se hai bisogno di aiuto.', '2023-07-22 10:20:00', 'expert', 1),
    (16, 'Ciao! Ci sono altri problemi riguardanti il prodotto?', '2023-07-22 10:30:00', 'expert', 1),
    (17, 'Al momento no, tutto sembra funzionare correttamente. Grazie!', '2023-07-22 10:40:00', 'customer', 1),
    (18, 'Perfetto! Se hai bisogno in futuro, non esitare a contattarci. Buona giornata!', '2023-07-22 10:50:00', 'expert', 1);
