create table logger(id integer primary key, dt datetime default current_timestamp, postdata varchar(100));

insert into logger(postdata) values ('TEST DATA');