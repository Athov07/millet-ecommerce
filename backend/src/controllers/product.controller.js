const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

/* Helper to convert buffer to Data URI */
const dataUri = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

/* CREATE PRODUCT (Admin) */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ success: false, message: "Main image is required" });
    }

    // Upload main image
    const mainImageCloud = await cloudinary.uploader.upload(dataUri(req.files.mainImage[0]), {
      folder: "avatars",
    });

    // Upload gallery images
    let galleryImages = [];
    if (req.files.images) {
      galleryImages = await Promise.all(
        req.files.images.map(async (file) => {
          const uploaded = await cloudinary.uploader.upload(dataUri(file), {
            folder: "avatars",
          });
          return { url: uploaded.secure_url };
        })
      );
    }

    // Save product in DB
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      mainImage: mainImageCloud.secure_url,
      images: galleryImages,
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* GET ALL PRODUCTS */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* GET SINGLE PRODUCT */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* UPDATE PRODUCT (Admin) */
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle main image
    if (req.files?.mainImage) {
      const mainImg = req.files.mainImage[0];
      const uploadedMain = await cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) throw new Error(error.message);
          updates.mainImage = result.secure_url;
        }
      );
      uploadedMain.end(mainImg.buffer);
    }

    // Handle gallery images
    if (req.files?.images) {
      const galleryImages = [];
      for (let img of req.files.images) {
        const uploaded = await cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) throw new Error(error.message);
            galleryImages.push({ url: result.secure_url });
          }
        );
        uploaded.end(img.buffer);
      }
      updates.images = galleryImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* DELETE PRODUCT (Admin) */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   GET RELATED PRODUCTS
============================ */
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category
    }).limit(4);

    res.status(200).json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
