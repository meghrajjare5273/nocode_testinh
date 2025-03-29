"use client";

import { motion } from "motion/react";
import { FileText, MessageSquare, BarChart2, PieChart } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Automated Machine Learning",
    description:
      "Train custom ML models without writing a single line of code. Our platform handles preprocessing, training, and evaluation.",
    link: "Learn More",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations and insights about your data from our advanced AI assistant.",
    link: "Learn More",
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-white" />,
    title: "Interactive Visualizations",
    description:
      "Explore your data and model performance with intuitive, interactive visualizations and dashboards.",
    link: "Learn More",
  },
  {
    icon: <PieChart className="h-6 w-6 text-white" />,
    title: "Model Deployment",
    description:
      "Deploy your trained models with a single click and integrate them into your applications via our API.",
    link: "Learn More",
  },
];

export function Features() {
  return (
    <section
      id="services"
      className="py-24 px-6 md:px-10 lg:px-20 bg-secondary"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            Powerful <span className="text-primary">ML capabilities</span>,
          </h2>
          <p className="text-xl text-white/70 max-w-3xl">
            simplified for everyone. Our platform makes machine learning
            accessible without sacrificing power or flexibility.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 mb-6 flex-grow">
                  {feature.description}
                </p>
                <div className="mt-auto">
                  <button className="text-primary hover:text-white bg-primary/10 hover:bg-primary transition-colors py-2 px-4 rounded-md text-sm font-medium w-full">
                    {feature.link}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
