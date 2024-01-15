#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

#------------------------------------------------------------
# Table: Author
#------------------------------------------------------------

CREATE TABLE AUTHORS(
	AUTID Int NOT NULL AUTO_INCREMENT,
	AUTNA Varchar (240) NOT NULL,
	AUTSU Varchar (80),
	
	CONSTRAINT AUTHOR_PK PRIMARY KEY (AUTID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Type
#------------------------------------------------------------

CREATE TABLE TYPE_MANGA(
	TYPID Int NOT NULL AUTO_INCREMENT,
	TYPNA Varchar (80) NOT NULL,

		CONSTRAINT TYPE_PK PRIMARY KEY (TYPID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Magazine
#------------------------------------------------------------

CREATE TABLE MAGAZINE(
	MAGID Int NOT NULL AUTO_INCREMENT,
	MAGNA Varchar (100) NOT NULL,
	
		CONSTRAINT CHAPTER_PK PRIMARY KEY (MAGID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Year
#------------------------------------------------------------

CREATE TABLE YEAR_PUB(
	YEAID Int NOT NULL AUTO_INCREMENT,
	YEANA Year NOT NULL,
	
		CONSTRAINT CHAPTER_PK PRIMARY KEY (YEAID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Team
#------------------------------------------------------------

CREATE TABLE TEAM(
	TEAID Int NOT NULL AUTO_INCREMENT,
	TEANA Varchar (240) NOT NULL,
	
		CONSTRAINT TEAM_PK PRIMARY KEY (TEAID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Status
#------------------------------------------------------------

CREATE TABLE STATUS_MANGA(
	STAID Int NOT NULL AUTO_INCREMENT,
	STANA Varchar (100) NOT NULL,
	
		CONSTRAINT CHAPTER_PK PRIMARY KEY (STAID)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Tag
#------------------------------------------------------------

CREATE TABLE TAG(
	TAGID Int NOT NULL AUTO_INCREMENT,
	TAGNA Varchar (100) NOT NULL,
	
		CONSTRAINT TAG_PK PRIMARY KEY (TAGID)
		
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Manga
#------------------------------------------------------------

CREATE TABLE MANGA(
	MANID Int NOT NULL AUTO_INCREMENT,
	MANNA Varchar (240) NOT NULL,
	MANAL Varchar (80),
	MANSU Varchar (1000) NOT NULL,
	MANNO Float,
	
	MAGFK Int,
	YEAFK Int,
	TYPFK Int,
	STAFK Int,

	MANST BOOLEAN DEFAULT True,

		CONSTRAINT MANGA_PK PRIMARY KEY (MANID),
		CONSTRAINT MAGAZINE_FK	FOREIGN KEY (MAGFK) REFERENCES MAGAZINE(MAGID),
		CONSTRAINT YEAR_FK 		FOREIGN KEY (YEAFK) REFERENCES YEAR_PUB(YEAID),
		CONSTRAINT TYPE_FK		FOREIGN KEY (TYPFK) REFERENCES TYPE_MANGA(TYPID),
		CONSTRAINT STATUS_FK	FOREIGN KEY (STAFK) REFERENCES STATUS_MANGA(STAID)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Chapter
#------------------------------------------------------------

CREATE TABLE CHAPTERS(
	CHAID Int NOT NULL AUTO_INCREMENT,
	CHANA Varchar (300) NOT NULL, 	
	CHANU Float NOT NULL, 		 
	CHAUR Varchar (500) NOT NULL,
	CHADA Date,

	MANFK Int,

	CHSTA BOOLEAN DEFAULT True,
	
		CONSTRAINT CHAPTER_PK PRIMARY KEY (CHAID),
		CONSTRAINT MANGA_FK FOREIGN KEY (MANFK) REFERENCES MANGA(MANID)


)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Explore
#------------------------------------------------------------

CREATE TABLE EXPLORE(
	EXPID Int NOT NULL AUTO_INCREMENT,
	MANFK Int NOT NULL,
	
		CONSTRAINT EXPLORE_PK PRIMARY KEY (EXPID),
		CONSTRAINT MANGA_EXP_FK FOREIGN KEY (MANFK) REFERENCES MANGA(MANID)
		
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Marqued_by
#------------------------------------------------------------

CREATE TABLE MARQUED_BY(
	MARID Int NOT NULL AUTO_INCREMENT,
	TAGID Int NOT NULL,
	MANID Int NOT NULL,
	
		CONSTRAINT MARQUED_BY_PK PRIMARY KEY (MARID),
		CONSTRAINT MARQUED_BY_TAG_FK FOREIGN KEY (TAGID) REFERENCES TAG(TAGID),
		CONSTRAINT MARQUED_BY_MANGA_FK FOREIGN KEY (MANID) REFERENCES MANGA(MANID),
		CONSTRAINT MARQUED_BY_UNIQUE_KEY UNIQUE(TAGID, MANID)
		
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Written_by
#------------------------------------------------------------

CREATE TABLE WRITTEN_BY(
	WRIID Int NOT NULL AUTO_INCREMENT,
	AUTID Int NOT NULL,
	MANID Int NOT NULL,
	
		CONSTRAINT WRITTEN_BY_PK PRIMARY KEY (WRIID),
		CONSTRAINT `WRITTEN_BY_AUTHOR_FK` FOREIGN KEY (AUTID) REFERENCES AUTHORS(AUTID),
		CONSTRAINT `WRITTEN_BY_MANGA_FK` FOREIGN KEY (MANID) REFERENCES MANGA(MANID),
		CONSTRAINT WRITTEN_BY_UNIQUE_KEY UNIQUE(AUTID, MANID)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Handled_by
#------------------------------------------------------------

CREATE TABLE HANDLED_BY(
	HANID Int NOT NULL AUTO_INCREMENT,
	TEAID Int NOT NULL,
	MANID Int NOT NULL,
	
		CONSTRAINT HANDLED_BY_PK PRIMARY KEY (HANID),
		CONSTRAINT `HANDLED_BY_TEAM_FK` FOREIGN KEY (TEAID) REFERENCES TEAM(TEAID),
		CONSTRAINT `HANDLED_BY_MANGA_FK` FOREIGN KEY (MANID) REFERENCES MANGA(MANID),
		CONSTRAINT HANDLED_BY_UNIQUE_KEY UNIQUE(MANID, TEAID)
)ENGINE=InnoDB;
