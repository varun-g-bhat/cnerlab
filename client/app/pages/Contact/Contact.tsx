"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: [{ label: "Inquiries", value: "cnerlab@gmail.com" }],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: [
      {
        label: "Address",
        value:
          "A220, Department of ECE, BMS Institute of Technology & Management, Yelahanka, Bengaluru - 560119",
      },
    ],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      { label: "Weekdays", value: "9:00 AM - 4:00 PM IST" },
      { label: "Weekends", value: "Closed" },
    ],
  },
];

const Contact: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  return (
    <div className="min-h-screen from-gray-900 to-black text-white p-8">
      <Card className="max-w-4xl mx-auto bg-transparent backdrop-blur-lg border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-clip-text text-black ">
            Get in Touch
          </CardTitle>
          <CardDescription className="text-xl mt-2 text-gray-500">
            We're always here to listen, help, and connect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {contactInfo.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-between text-left border-gray-700 hover:bg-gray-300 rounded"
                  onClick={() =>
                    setExpandedSection(expandedSection === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </div>
                  {expandedSection === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <AnimatePresence>
                  {expandedSection === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Card className="mt-2 border-gray-700">
                        <CardContent className="pt-6">
                          {section.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="mb-4 last:mb-0">
                              <p className="text-sm text-gray-500">
                                {detail.label}
                              </p>
                              <p className="font-semibold">{detail.value}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
