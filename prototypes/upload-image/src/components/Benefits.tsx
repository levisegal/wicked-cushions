export default function Benefits() {
  const benefits = [
    {
      icon: "🛋️",
      title: "Comfort & Thickness",
      description: "Soft memory foam provides a snug, pressure-free fit for extended listening sessions.",
    },
    {
      icon: "🔊",
      title: "Superior Sound Quality",
      description: "Improves noise isolation for clearer sound with enhanced bass and crisp highs.",
    },
    {
      icon: "💪",
      title: "Durability",
      description: "Made from premium materials, built to withstand daily wear and tear.",
    },
    {
      icon: "✓",
      title: "Perfect Compatibility",
      description: "Easy to install and perfectly designed for different models.",
    },
    {
      icon: "🎨",
      title: "Unique Designs",
      description: "Sleek, modern design with color options to refresh your headphones' look.",
    },
    {
      icon: "❄️",
      title: "Cooling Technology",
      description: "Cooling gel prevents heat buildup, keeping your ears cool and comfortable during long use.",
    },
  ];

  return (
    <section className="bg-[#1a1a1a] text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center mb-12">
          <span className="font-display text-3xl md:text-4xl">TOP BENEFITS</span>
          <br />
          <span className="font-display text-3xl md:text-4xl text-[#ff6633]">YOU'LL LOVE</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-4xl">{benefit.icon}</div>
              <h3 className="font-display text-xl text-[#ff6633]">{benefit.title}</h3>
              <p className="text-gray-300 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

