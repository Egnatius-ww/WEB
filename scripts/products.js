(function () {
  function spec(label, value) {
    return { label: label, value: value };
  }

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
        spec("Volume", "5 gallons total"),
        spec("Type", "100% Acrylic Latex"),
        spec("Coverage", "400 sq ft per gallon"),
        spec("Finish", "Satin"),
        spec("Dry Time", "2–4 hours"),
        spec("Colors", "Assorted neutral tones"),
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
        "Versatile construction-grade plywood sheets suitable for a wide range of applications. These sheets are engineered for strength and dimensional stability, perfect for subfloors, roofing, walls, and general construction.",
      specs: [
        spec("Dimensions", "4' × 8'"),
        spec("Thickness", "3/4 inch"),
        spec("Grade", "CDX"),
        spec("Plies", "7-ply construction"),
        spec("Exposure", "Exterior grade"),
        spec("Veneer", "Softwood"),
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
        "High-quality Portland cement bags designed for heavy-duty construction projects. Our premium cement offers exceptional strength, durability, and workability. Ideal for foundations, structural work, and general concrete applications. Each bag contains precisely measured and tested cement that meets international quality standards.",
      specs: [
        spec("Weight", "50 lbs per bag"),
        spec("Type", "Portland Cement Type I/II"),
        spec("Compressive strength", "3500 PSI at 28 days"),
        spec("Setting time", "2–4 hours initial set"),
        spec("Coverage", "Approximately 0.45 cubic feet"),
        spec("Storage life", "6 months in sealed bag"),
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
        "Premium kiln-dried lumber planks perfect for all your woodworking and construction needs. These high-grade wooden planks are carefully selected for strength and appearance. Suitable for framing, decking, furniture making, and various carpentry projects.",
      specs: [
        spec("Dimensions", "2\" × 6\" × 8'"),
        spec("Wood type", "Douglas Fir"),
        spec("Grade", "Premium Select"),
        spec("Moisture content", "15% kiln-dried"),
        spec("Treatment", "Pressure-treated option available"),
        spec("Quantity", "Sold individually"),
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
        "Traditional red clay bricks manufactured to the highest standards. These durable bricks are perfect for walls, patios, pathways, and architectural features. Fire-hardened for exceptional strength and weather resistance.",
      specs: [
        spec("Dimensions", "8\" × 4\" × 2.25\""),
        spec("Material", "Fire-hardened clay"),
        spec("Compressive strength", "3000+ PSI"),
        spec("Water absorption", "Less than 8%"),
        spec("Color", "Classic red"),
        spec("Weight", "4.5 lbs per brick"),
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
        "Heavy-duty structural steel I-beams engineered for maximum load-bearing capacity. These professional-grade beams are essential for large construction projects, building frames, and structural support applications.",
      specs: [
        spec("Length", "20 feet"),
        spec("Profile", "W10x49"),
        spec("Material", "ASTM A992 Grade 50 Steel"),
        spec("Weight", "980 lbs"),
        spec("Yield strength", "50 ksi"),
        spec("Finish", "Mill finish"),
      ],
    },
  ];

  window.BUILDMART_PRODUCTS = P;

  window.getBuildmartProductById = function (id) {
    if (!id) return null;
    for (var i = 0; i < P.length; i++) {
      if (P[i].id === id) return P[i];
    }
    return null;
  };
})();
