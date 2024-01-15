
class request_builder:
     
    def __init__(self, table) -> None:

        self.string_builder = "INSERT INTO "+table.upper()+" ("
        self.placeholders = "("
        self.insert_end = {
            "Authors": 2,
            "Manga": 3,
        }


    def get_insert_end(self, table, column_number):

        try: 
            end = self.insert_end[table]

        except:
            end = 1

        return column_number - end


    def partial_string_builder(self, start, end, col):

        str_partial = ""
        place_partial = ""
        for i in range(start, end):
                str_partial += col[i] + ", "
                place_partial += "?, "

        return str_partial, place_partial


    def insert_builder(self, table, col):

        end = self.get_insert_end(table, len(col))

        str_partial, vals_partial = self.partial_string_builder(1, end, col)
        self.string_builder += str_partial + col[end] +") VALUES "
        self.placeholders += vals_partial + "?)"

        return self.string_builder + self.placeholders
