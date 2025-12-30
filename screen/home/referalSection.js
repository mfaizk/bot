import { motion } from "framer-motion";

export default function ReferralSection() {
    const cards = [
      {
        title: "Share Your Referral Link",
        description:
          "Spread the word by sharing your unique referral link with your friends, colleagues, and fellow traders. The more people you invite, the more you earn!",
        imgSrc: "/assets/homepage/img1.avif",
        alt: "Share Referral",
      },
      {
        title: "Your Friend Subscribes",
        description:
          "When your referred user signs up and purchases a subscription plan, they gain access to powerful crypto trading tools — and you start earning rewards.",
        imgSrc: "/assets/homepage/img1.avif",
        alt: "Friend Subscribes",
      },
      {
        title: "Earn up to 10% Instantly",
        description:
          "Get 10% of the plan amount for every direct referral and 5% for indirect referrals — directly in your account. More referrals = higher earnings!",
        imgSrc: "/assets/homepage/img1.avif",
        alt: "Earn Rewards",
      },
    ];
  
    return (
      <div className=" bg-[#05060f] gap-5 p-[2%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards?.map((card, index) => (


            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-[#1b1b2f] to-[#141424] rounded-3xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              
              <div>
                <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">
                  {card.description}
                </p>
              </div>
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mt-auto">
                <img
                  src={card.imgSrc}
                  alt={card.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  