puts %Q{insert into day(date) values('#{ARGV[0]}');
select LAST_INSERT_ID() into @dayid;
insert into trip(truck,driver,`index`,dayid) values(#[ARGV[1]},#{ARGV[2],#{ARGV[3]},@dayid);
select LAST_INSERT_ID() into @tripid;
insert into triporder(tripid,orderid,`index`) values(@tripid,(select lnextid from tnxtpids where lid = 62)-3,1),
																										(@tripid,(select lnextid from tnxtpids where lid = 62)-2,2),
																										(@tripid,(select lnextid from tnxtpids where lid = 62)-1,3);
}