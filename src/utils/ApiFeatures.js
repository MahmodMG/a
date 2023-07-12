class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1 pagination ===========
  paginate() {
    // console.log(this.queryString.page);
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    let skip = (page - 1) * 5;

    this.page = page;
    this.mongooseQuery.skip(skip).limit(20);
    return this;
    // return this to chain methods
  }
  // 2 filter =================
  filter() {
    let filterobj = { ...this.queryString }; // copy obj
    let excludedQuery = ["page", "sort", "fields", "keyword"];
    excludedQuery.forEach((q) => {
      delete filterobj[q];
    });
    // console.log(filterobj);
    filterobj = JSON.stringify(filterobj);
    filterobj = filterobj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterobj = JSON.parse(filterobj);

    this.mongooseQuery.find(filterobj);
    return this;
  }

  // 3 sort =================
  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  // 4 search ===============
  // $regex , $options: "i" to search with upper and lower case
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  // 5  select fields=============
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}

module.exports = ApiFeatures;
