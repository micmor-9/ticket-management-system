export const mockOrders = [
  {
    id: 1,
    customer: {
      id: 2,
      email: "user2@example.com",
      name: "Giulio",
      surname: "Bianchi",
    },
    product: {
      id: "10",
      name: "iphone",
    },
    date: "2022-05-16T16:19:09.000+00:00",
    warrantyDuration: "2024-05-16T16:19:18.000+00:00",
  },
  {
    id: 2,
    customer: {
      id: 1,
      email: "user1@example.com",
      name: "Mario",
      surname: "Rossi",
    },
    product: {
      id: "11",
      name: "ipad",
    },
    date: "2023-03-16T17:51:30.000+00:00",
    warrantyDuration: "2025-05-16T17:51:36.000+00:00",
  },
  {
    id: 3,
    customer: {
      id: 2,
      email: "user2@example.com",
      name: "Giulio",
      surname: "Bianchi",
    },
    product: {
      id: "12",
      name: "mac",
    },
    date: "2023-02-16T18:07:21.000+00:00",
    warrantyDuration: "2027-05-16T18:07:26.000+00:00",
  }
];
