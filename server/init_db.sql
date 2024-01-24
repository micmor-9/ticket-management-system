INSERT INTO public.customer (id, email, name, surname, contact, address1, address2)
VALUES (101, 'user1@example.com', 'Mario', 'Rossi', '3333333333', 'Via Roma 1', 'Milano');
INSERT INTO public.customer (id, email, name, surname, contact, address1)
VALUES (202, 'user2@example.com', 'Giulio', 'Bianchi', '3454447632', 'Corso Peschiera');

INSERT INTO public.expert (id, email, name, surname, specialization)
VALUES ('B001',
        'expert1@example.com',
        'Roberto',
        'DiCiaula',
        'Battery');
INSERT INTO public.expert (id, email, name, surname, specialization)
VALUES ('D002',
        'expert2@example.com',
        'Michele',
        'Morgigno',
        'Display');
INSERT INTO public.expert (id, email, name, surname, specialization)
VALUES ('S003',
        'expert3@example.com',
        'Michele',
        'Galati',
        'Speakers');
INSERT INTO public.manager (id, email, name, surname)
VALUES ('M001',
        'manager1@example.com',
        'Giovanni',
        'Malnati');



