class StorageAddress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    row = db.Column(db.String(2), nullable=False)
    column = db.Column(db.Integer, nullable=False)
    cell = db.Column(db.Integer, nullable=False)
    place = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"StorageAddress({self.row}-{self.column:02}-{self.cell:02}-{self.place:02})" 