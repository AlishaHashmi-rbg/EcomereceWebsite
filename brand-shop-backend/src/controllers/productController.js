import Product from '../models/Product.js';

// GET /api/products
// Query: search, cat, brand, minPrice, maxPrice, sort, page, limit, freeShipping
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      cat,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
      freeShipping,
    } = req.query;

    const filter = {};

    // Full-text search on name/description/brand
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter (case-insensitive partial match)
    if (cat && cat !== 'All category') {
      filter.category = { $regex: cat, $options: 'i' };
    }

    // Brand filter (comma-separated: ?brand=Samsung,Apple)
    if (brand) {
      const brands = brand.split(',').map((b) => b.trim());
      filter.brand = { $in: brands };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Free shipping filter
    if (freeShipping === 'true') {
      filter.freeShipping = true;
    }

    // Sort options matching frontend: Featured | Price: Low | Price: High | Rating
    let sortOption = {};
    switch (sort) {
      case 'Price: Low':
        sortOption = { price: 1 };
        break;
      case 'Price: High':
        sortOption = { price: -1 };
        break;
      case 'Rating':
        sortOption = { rating: -1 };
        break;
      case 'Newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { orders: -1 }; // "Featured" = most ordered
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id/related
// Returns products in the same category, excluding current product
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(6);

    res.json(related);
  } catch (error) {
    next(error);
  }
};

// POST /api/products  (admin only)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id  (admin only)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id  (admin only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/categories
// Returns list of distinct categories (for Header dropdowns)
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/brands
// Returns list of distinct brands (for ProductsPage sidebar)
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    next(error);
  }
};