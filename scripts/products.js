/**
 * Shared catalog ↔ product card data. IDs match ?id= on card.html and catalog links.
 */
(function () {
  var P = [
    {
      id: "exterior-paint",
      title: "Exterior Paint Set",
      price: 45.99,
      rating: 3.5,
      category: "Paint & Coatings",
      image:
        "https://images.unsplash.com/photo-1673297821205-e0575bbc2ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "Professional-grade exterior paint set designed to withstand harsh weather conditions. This premium paint offers excellent coverage, durability, and color retention. Perfect for residential and commercial exterior surfaces.",
      specs: [
        { label: "Volume", value: "5 gallons total" },
        { label: "Type", value: "100% Acrylic Latex" },
        { label: "Coverage", value: "400 sq ft per gallon" },
        { label: "Finish", value: "Satin" },
        { label: "Dry Time", value: "2–4 hours" },
        { label: "Colors", value: "Assorted neutral tones" },
      ],
    },
    {
      id: "plywood-sheets",
      title: "Plywood Sheets",
      price: 52.99,
      rating: 4.5,
      category: "Wood & Lumber",
      image:
        "https://images.unsplash.com/photo-1704167674713-649193461719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "High-quality structural plywood for framing, sheathing, and general construction. Sanded faces and consistent thickness for reliable results on the job site.",
      specs: [
        { label: "Thickness", value: "3/4 in" },
        { label: "Grade", value: "BC" },
        { label: "Core", value: "Softwood veneer" },
        { label: "Sheet size", value: "4 ft × 8 ft" },
        { label: "Moisture", value: "Exterior glue" },
        { label: "Application", value: "Sheathing, subfloor" },
      ],
    },
    {
      id: "premium-cement-bags",
      title: "Premium Cement Bags",
      price: 24.99,
      rating: 5,
      category: "Cement & Concrete",
      image:
        "https://images.unsplash.com/photo-1718117075248-3d3c3cd65264?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "Portland cement blend for foundations, slabs, and masonry work. Consistent setting time and strong compressive strength for structural pours.",
      specs: [
        { label: "Weight", value: "94 lb per bag" },
        { label: "Type", value: "Type I/II" },
        { label: "Yield", value: "~1 cu ft per bag" },
        { label: "Set time", value: "Initial 45–60 min" },
        { label: "Use", value: "Concrete, mortar, grout" },
        { label: "Storage", value: "Dry, covered" },
      ],
    },
    {
      id: "premium-lumber-planks",
      title: "Premium Lumber Planks",
      price: 89.99,
      rating: 4.5,
      category: "Wood & Lumber",
      image:
        "https://images.unsplash.com/photo-1764025390519-1ccc15d719a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "Kiln-dried dimensional lumber selected for straight grain and minimal warp. Ideal for framing, decking, and visible interior projects.",
      specs: [
        { label: "Species", value: "SPF" },
        { label: "Dimension", value: "2 in × 6 in × 12 ft" },
        { label: "Grade", value: "#2 & better" },
        { label: "Moisture", value: "Kiln-dried ~15%" },
        { label: "Treatment", value: "None (interior)" },
        { label: "Bundle", value: "Sold per piece" },
      ],
    },
    {
      id: "red-clay-bricks",
      title: "Red Clay Bricks",
      price: 0.89,
      rating: 4,
      category: "Bricks & Blocks",
      image:
        "https://images.unsplash.com/photo-1761358270922-5a4df4ab9782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "Classic fired clay bricks for walls, paths, and veneer. Uniform size and rich color for traditional masonry finishes.",
      specs: [
        { label: "Size", value: "Standard modular" },
        { label: "Color", value: "Red/brown blend" },
        { label: "Compressive strength", value: "3000+ PSI" },
        { label: "Absorption", value: "Moderate" },
        { label: "Sold", value: "Per brick" },
        { label: "Use", value: "Veneer, garden, repair" },
      ],
    },
    {
      id: "steel-i-beams",
      title: "Steel I-Beams",
      price: 349.99,
      rating: 5,
      category: "Steel & Metal",
      image:
        "https://images.unsplash.com/photo-1707236527163-bd3478178466?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      description:
        "Structural steel wide-flange beams for load-bearing spans. Mill-certified material suitable for commercial and residential steel framing.",
      specs: [
        { label: "Profile", value: "W-shape wide flange" },
        { label: "Length", value: "20 ft (typical)" },
        { label: "Grade", value: "A992 / A572" },
        { label: "Finish", value: "Mill scale" },
        { label: "Certification", value: "Mill test reports available" },
        { label: "Handling", value: "Crane or forklift" },
      ],
    },
  ];

  P.forEach(function (item) {
    var u = item.image;
    item.gallery = [u, u, u];
  });

  window.BUILDMART_PRODUCTS = P;

  window.getBuildmartProductById = function (id) {
    if (!id) return null;
    for (var i = 0; i < P.length; i++) {
      if (P[i].id === id) return P[i];
    }
    return null;
  };
})();
