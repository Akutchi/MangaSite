import mariadb
import request_builder as rqb

def Split_Field_If_Possible(manga_data, col_name, index):

    split_fk = (manga_data.iloc[index][col_name]).split(" ")

    try:
        split_fk.index('')
        split_fk.remove('')
    except:
        pass

    return split_fk

def connect():

    conn = mariadb.Connection(user="root",
            password="bsroot",
            host="localhost",
            database="mangasite")

    return conn

def disconnect(conn):
    conn.close()

def check_type(table, data):

    if table == "Explore":
        return (data[0].item(),)

    elif table == "Chapters":
        return (data[0], int(data[1]), data[2], data[3], data[4].item(),)

    elif table == "Year_pub":
        return (data[0].item(),)

    elif table == "Manga":
        return (data[0], data[1], data[2], data[3], data[4].item(), data[5].item(), data[6].item(), data[7].item())

    elif table == "Authors":
        return (data[0], data[1],)

    else:
        return data


def format_data(table_info, i):

    formatted_data = []
    data_i = table_info["data"].iloc[i]

    for col in table_info["original_col"]:
        formatted_data.append(data_i[col])

    return tuple(formatted_data)

def insert_assoc_authors(conn, tables):

    cur = conn.cursor()
    authors_data = tables["Authors"]["data"]

    for i in range(0, authors_data.shape[0]-1):
        cur.execute(f"INSERT INTO WRITTEN_BY (AUTID, MANID) VALUES (?, ?)", (i+1, authors_data.iloc[i]["manga fk"].item(),))

    conn.commit()

def insert_assoc_manga(conn, tables):

    cur = conn.cursor()
    manga_data = tables["Manga"]["data"]

    for i in range(0, manga_data.shape[0]):

        split_tag = Split_Field_If_Possible(manga_data, "tags fk", i)
        split_team = Split_Field_If_Possible(manga_data, "team fk", i)

        for field_value in split_tag:

            try:
                cur.execute("INSERT INTO MARQUED_BY (TAGID, MANID) VALUES (?, ?)", (int(field_value), i+1,))

            except mariadb.Error as e:
                print(f"Error Inserting. cause : {e}")

        conn.commit()

        for field_value in split_team:

            try:
                cur.execute("INSERT INTO HANDLED_BY (TEAID, MANID) VALUES (?, ?)", (int(field_value), i+1,))

            except mariadb.Error as e:
                print(f"Error Inserting. cause : {e}")

        conn.commit()


def insert_into(conn, table, col, values):

    cur = conn.cursor()
    builder = rqb.request_builder(table)
    try:
        cur.execute(builder.insert_builder(table, col), values)
        conn.commit()

    except mariadb.Error as e:
        print(f"Error Inserting : {values} cause : {e}")



