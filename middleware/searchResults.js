const searchResults = (model, populate,field) => async (req, res, next) => { 

    let searchTerm = req.query.search;
    let spacedSearchTerm=searchTerm.split('%').join(' ');
    let query
    if (field ==='name'){
        query = model.find({name: {$regex : spacedSearchTerm, $options:'$i'}})
    }
    else{
        query = model.find({title: {$regex : spacedSearchTerm, $options:'$i'}})
    }
   

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    

    if (field ==='name'){
        totalQuery = model.countDocuments({name: {$regex : spacedSearchTerm, $options:'$i'}});
    }
    else{
        totalQuery = model.countDocuments({title: {$regex : spacedSearchTerm, $options:'$i'}});
    }
    
    const total = await totalQuery;


    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
      }

    // Executing query
    const results = await query;

    // Pagination result

    const pagination = {};
    
    if (endIndex < total) {
    pagination.next = {
        page: page + 1,
        limit
    };
    }

    if (startIndex > 0) {
    pagination.prev = {
        page: page - 1,
        limit
    };
    }

    res.searchResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
      };
    
    next();
};

module.exports = searchResults;
