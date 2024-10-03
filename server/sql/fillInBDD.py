import pandas as pd
import BDD_utils
import glob
import re
import os  

BASE_PATH = "./data/"
BASE_NAME = "tables - "

tables = {}

def getTables():

    for file in glob.glob("./data/*.csv"):

        _, tail = os.path.split(file)
        fileName = re.match(r"tables - ([a-zA-z]+).csv", tail).group(1)
        tables[fileName] = {"raw_columns":[], "BDD_columns":[], "data":[]}


def getFields():

    for table in tables.keys():

        data_table = pd.read_csv(BASE_PATH+BASE_NAME+table+".csv")
        tables[table]["data"] = data_table
        tables[table]["raw_columns"] = data_table.columns.values

        # there's always an ID, for example, MANID (for Manga ID)
        tables[table]["BDD_columns"].append(table.upper()[0:3]+"ID")
        
        for field in tables[table]["raw_columns"]:
            
            field_components = field.split(" ")

            # format BDD names like in ./sql/scripts/bdd_init.sql
            # e.g CHANU for Chapter Number
            if len(field_components) == 2:
                tables[table]["BDD_columns"].append(field_components[0].upper()[0:3]+field_components[1].upper()[0:2])

            # For "Summary" to become MANSU
            elif len(field_components) == 1 and table == "Manga":
                tables[table]["BDD_columns"].append(table.upper()[0:3]+field.upper()[0:2])
                
            else:
                tables[table]["BDD_columns"].append(table.upper()[0:3]+"NA")


def fill_in(conn, table):

    for i in range(0, tables[table]["data"].shape[0]):     
        formatted_data = BDD_utils.format_data(tables[table], i)
        formatted_data = BDD_utils.check_type(table, formatted_data)
        BDD_utils.insert_into(conn, table, tables[table]["BDD_columns"], formatted_data)


def fill_in_association(conn, tables):

    BDD_utils.insert_assoc_authors(conn, tables)
    BDD_utils.insert_assoc_manga(conn, tables)    

if __name__ == "__main__":

    getTables()
    getFields()

    try:
        conn = BDD_utils.connect()
    except:
        print("Not Connected")
        exit(-1)

    # can't tables.keys() because I want to control the order of insertion (FK)
    for table in ["Magazine", "Year_pub", "Tag", "Team", "Status_manga", "Type_manga", "Manga", "Authors", "Chapters", "Explore"]: 
        fill_in(conn, table)

    fill_in_association(conn, tables)
    
    BDD_utils.disconnect(conn)

