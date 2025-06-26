const modules = import.meta.glob("./*.jsx", { eager: true });

const staff = {};

Object.keys(modules).forEach((filePath) => {
  // Extract component name from filename (e.g., "./Button.jsx" → "Button")
  const pageName = filePath.replace("./", "").replace(".jsx", "");
  staff[pageName] = modules[filePath].default;
});

export default staff;
