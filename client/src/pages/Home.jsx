import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  PlayIcon,
  CalendarIcon,
  MusicalNoteIcon,
  SparklesIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Button3D from "../components/ui/Button3D";
import AudioPlayer from "../components/threejs/AudioPlayer";
import { useAudio } from "../context/AudioContext";

import heroBackground from "../assets/lobodo hero.jfif";
import recordImage from "../assets/mic.png";

export default function Home() {
  const { loadTrack } = useAudio();

  // Responsive pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const itemsPerPage = isLargeScreen ? 12 : 8;

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const featuredTracks = [
    {
      id: 1,
      title: "Blessings",
      artist: "Miracle Chinga",
      genre: "Gospel",
      likes: "18.2k",
      plays: "520k",
      releaseTime: "Today",
      duration: "4:15",
      cover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/miracle-chinga-blessings.mp3",
    },
    {
      id: 2,
      title: "Grace",
      artist: "Miracle Chinga",
      genre: "Gospel",
      likes: "16.5k",
      plays: "480k",
      releaseTime: "2 days ago",
      duration: "3:45",
      cover:
        "https://images.unsplash.com/photo-1510906594845-bc082582c8cc?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/miracle-chinga-grace.mp3",
    },
    {
      id: 3,
      title: "Faithful",
      artist: "Miracle Chinga",
      genre: "Gospel",
      likes: "14.8k",
      plays: "410k",
      releaseTime: "1 week ago",
      duration: "3:58",
      cover:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/miracle-chinga-faithful.mp3",
    },
    {
      id: 4,
      title: "Hallelujah",
      artist: "Miracle Chinga",
      genre: "Gospel",
      likes: "13.2k",
      plays: "390k",
      releaseTime: "2 weeks ago",
      duration: "4:20",
      cover:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/miracle-chinga-hallelujah.mp3",
    },
    {
      id: 5,
      title: "Divine",
      artist: "Evance Meleka",
      genre: "Afro-Gospel",
      likes: "12.4k",
      plays: "350k",
      releaseTime: "3 weeks ago",
      duration: "3:35",
      cover:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/evance-meleka-divine.mp3",
    },
    {
      id: 6,
      title: "Worship",
      artist: "Evance Meleka",
      genre: "Afro-Gospel",
      likes: "11.9k",
      plays: "340k",
      releaseTime: "1 month ago",
      duration: "4:02",
      cover:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
      audioUrl: "https://example.com/evance-meleka-worship.mp3",
    },
  ];

  // Pagination calculations
  const totalPages = Math.ceil(featuredTracks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTracks = featuredTracks.slice(startIndex, endIndex);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-20" />
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src={heroBackground}
              alt="Lobodo Records Studio"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-0 lg:gap-y-8 items-center">
            {/* 1. Left Side: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-7 text-center lg:text-left order-1"
            >
              <h1 className="font-heading font-bold mb-0 md:mb-6 tracking-tighter leading-none text-white drop-shadow-2xl">
                <span className="block text-2xl md:text-3xl text-primary font-medium tracking-wider mb-2 uppercase">
                  Welcome to
                </span>
                <span className="text-6xl md:text-8xl lg:text-9xl">
                  Lobodo{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#B8860B] block lg:inline">
                    Records
                  </span>
                </span>
              </h1>

              <p className="hidden md:block text-xl md:text-2xl text-gray-300 mb-0 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light tracking-wide">
                Where sound meets vision. Experience immersive music production
                in <span className="text-white font-medium">Malawi's</span>{" "}
                state-of-the-art studio facility.
              </p>
            </motion.div>

            {/* 2. Right Side: Image (Middle on mobile, Right on Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 120 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="lg:col-span-5 lg:row-span-2 order-2 relative -mt-6 lg:mt-0"
            >
              <div className="relative aspect-square max-w-[350px] md:max-w-[450px] lg:max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent-pink/30 rounded-full blur-3xl animate-pulse-slow" />
                <img
                  src={recordImage}
                  alt="Vinyl Record"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-[spin_10s_linear_infinite]"
                />
              </div>
            </motion.div>

            {/* 3. Left Side: Buttons (Bottom on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-7 text-center lg:text-left order-3 -mt-8 lg:mt-0"
            >
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                <Link to="/productions">
                  <Button3D
                    variant="primary"
                    size="lg"
                    className="group min-w-[220px]"
                  >
                    <PlayIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                    Explore Productions
                  </Button3D>
                </Link>

                <Link to="/booking">
                  <Button3D
                    variant="secondary"
                    size="lg"
                    className="min-w-[220px]"
                  >
                    <CalendarIcon className="h-6 w-6 mr-3" />
                    Book Session
                  </Button3D>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Productions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fresh from Studio - Centered */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="w-full max-w-5xl flex flex-col gap-6">
                <div className="bg-[#B8860B] text-white px-6 py-3 rounded-md shadow-lg">
                  <h2 className="text-xl font-bold font-heading uppercase tracking-wide text-center">
                    Fresh from Studio
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-effect rounded-3xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors duration-300"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-accent-pink/10 rounded-full -translate-y-32 translate-x-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/90 border border-white/10 flex items-center gap-1.5 shadow-sm">
                          <CalendarIcon className="w-3 h-3 text-primary" />
                          {track.releaseTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 mb-4 relative z-10">
                        <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <img
                            src={track.cover}
                            alt={track.title}
                            className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-primary/20 transition-all duration-500"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-xl font-bold mb-1 text-white group-hover:text-primary truncate transition-colors">
                            {track.title}
                          </h3>
                          <p className="text-text-secondary text-sm mb-3">
                            {track.artist}
                          </p>

                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-white/5 px-2.5 py-1 rounded-full">
                              <HeartIcon className="w-3.5 h-3.5 text-accent-pink" />
                              {track.likes}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-white/5 px-2.5 py-1 rounded-full">
                              <PlayIcon className="w-3.5 h-3.5 text-primary" />
                              {track.plays}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-2 border-t border-white/5 pt-4 relative z-10">
                        <button
                          onClick={() => loadTrack(track)}
                          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                          <PlayIcon className="w-4 h-4" />
                          Play
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/20 hover:-translate-y-0.5">
                          <HeartIcon className="w-4 h-4 text-accent-pink" />
                          Like
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-8">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg glass-effect disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? "bg-primary text-white"
                                : "glass-effect hover:bg-white/5"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && (
                        <span className="text-text-secondary">...</span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg glass-effect disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AudioPlayer />
      </div>
    </div>
  );
}
