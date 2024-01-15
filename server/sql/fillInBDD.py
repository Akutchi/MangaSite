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
        tables[fileName] = {"original_col":[], "BDD_col":[], "data":[]}


def getFields():

    for table in tables.keys():

        data_table = pd.read_csv(BASE_PATH+BASE_NAME+table+".csv")
        tables[table]["data"] = data_table
        tables[table]["original_col"] = data_table.columns.values
        tables[table]["BDD_col"].append(table.upper()[0:3]+"ID")
        
        for field in data_table.columns.values:
            
            field_sep = field.split(" ")

            if len(field_sep) == 2:
                tables[table]["BDD_col"].append(field_sep[0].upper()[0:3]+field_sep[1].upper()[0:2])
            elif len(field_sep) == 1 and table == "Manga":
                tables[table]["BDD_col"].append(table.upper()[0:3]+field.upper()[0:2])
            else:
                tables[table]["BDD_col"].append(table.upper()[0:3]+"NA")


def fill_in(conn, table):

    for i in range(0, tables[table]["data"].shape[0]):     
        formatted_data = BDD_utils.format_data(tables[table], i)
        formatted_data = BDD_utils.check_type(table, formatted_data)
        BDD_utils.insert_into(conn, table, tables[table]["BDD_col"], formatted_data)


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

