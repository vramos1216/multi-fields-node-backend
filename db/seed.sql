CREATE TABLE users (
                       ID SERIAL PRIMARY KEY,
                       firstname VARCHAR(50),
                       lastname VARCHAR(50),
                       emailaddress VARCHAR(50)
);

INSERT INTO
    users (firstname, lastname, emailaddress)
VALUES
    ('John', 'Doe','jdoe@aol.com'),
    ('Melvin','Doe', 'mdoe@aol.com'),
    ('Smith','Doe', 'sdoe@aol.com');