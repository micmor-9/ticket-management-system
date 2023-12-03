INSERT INTO public.customer (id, email, name, surname, contact, address1, address2)
VALUES (101, 'user1@example.com', 'Mario', 'Rossi', '3333333333', 'Via Roma 1', 'Milano');
INSERT INTO public.customer (id, email, name, surname, contact, address1)
VALUES (202, 'user2@example.com', 'Giulio', 'Bianchi', '3454447632', 'Corso Peschiera');

INSERT INTO public.expert (id, email, name, surname, specialization)
VALUES ('B001',
        'expert1@example.com',
        'Roberto',
        'Di Ciaula',
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
INSERT INTO public.manager (id, email, name, surname, managed_area)
VALUES ('M001',
        'manager1@example.com',
        'Giovanni',
        'Malnati',
        'Battery');
INSERT INTO public.product (id, name, description, price, quantity, warranty_duration)
VALUES ('P001IPX', 'iphone', 'iPhone 15 Pro Max', 1000, 10, '6 months');
INSERT INTO public.product (id, name, description, price, quantity, warranty_duration)
VALUES ('P002IPA', 'ipad', 'iPad Air', 1000, 10, '2 years');
INSERT INTO public.product (id, name, description, price, quantity, warranty_duration)
VALUES ('P003MBP', 'mac', 'Mac 15 Pro Max', 2000, 20, '4 years');


/*INSERT INTO public.orders (
    id,
    date,
    warranty_duration,
    customer_id,
    product_id,
    quantity
  )
VALUES (
    1,
    '2022-05-16 16:19:09.000000',
    '2024-05-16 16:19:18.000000',
    '2',
    '10',
    1
  );
INSERT INTO public.orders (
    id,
    date,
    warranty_duration,
    customer_id,
    product_id,
    quantity
  )
VALUES (
    2,
    '2023-03-16 17:51:30.000000',
    '2025-05-16 17:51:36.000000',
    '1',
    '11',
    2
  );
INSERT INTO public.orders (
    id,
    date,
    warranty_duration,
    customer_id,
    product_id,
    quantity
  )
VALUES (
    3,
    '2023-02-16 18:07:21.000000',
    '2027-05-16 18:07:26.000000',
    '2',
    '12',
    3
  );
INSERT INTO public.ticket (
    id,
    creation_timestamp,
    issue_description,
    priority,
    status,
    customer_id,
    expert_id,
    product_id,
    category
  )
VALUES (
    1,
    '2023-05-16 16:19:55.000000',
    'batteria rovinata',
    'LOW',
    'OPEN',
    '2',
    'B001',
    '10',
    'battery'
  );
INSERT INTO public.ticket (
    id,
    creation_timestamp,
    issue_description,
    priority,
    status,
    customer_id,
    expert_id,
    product_id,
    category
  )
VALUES (
    2,
    '2023-05-06 17:50:41.000000',
    'schermo rotto',
    'LOW',
    'RESOLVED',
    '1',
    'D002',
    '11',
    'display'
  );
INSERT INTO public.ticket (
    id,
    creation_timestamp,
    issue_description,
    priority,
    status,
    customer_id,
    expert_id,
    product_id,
    category
  )
VALUES (
    52,
    '2023-05-16 18:11:07.182000',
    'cuffie',
    'LOW',
    'IN_PROGRESS',
    '2',
    'S003',
    '12',
    'speakers'
  );
INSERT INTO public.ticket_status (
    id,
    description,
    status,
    status_timestamp,
    expert_id,
    ticket_id,
    category
  )
VALUES (
    53,
    'caricatore rotto',
    'IN_PROGRESS',
    '2023-05-16 18:14:59.391000',
    'B001',
    52,
    'battery'
  );
INSERT INTO public.ticket_status (
    id,
    description,
    status,
    status_timestamp,
    expert_id,
    ticket_id,
    category
  )
VALUES (
    102,
    'schermo rotto',
    'IN_PROGRESS',
    '2023-05-16 18:17:26.554000',
    'D002',
    2,
    'display'
  );
INSERT INTO public.ticket_status (
    id,
    description,
    status,
    status_timestamp,
    expert_id,
    ticket_id,
    category
  )
VALUES (
    103,
    'schermo rotto',
    'RESOLVED',
    '2023-05-16 18:17:40.716000',
    'D002',
    2,
    'display'
  );*/