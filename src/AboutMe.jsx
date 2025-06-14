export default function AboutMe() {
  return (
    <div className="h-full flex-1 p-8 bg-secondary text-primary flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-heading mb-4">About Me</h1>
      <p className="text-lg text-muted mb-6 max-w-2xl text-center">
        Hi, I'm Kody — a self-taught developer with a strong curiosity for how things work and a
        tendency to deep-dive until I've figured them out. My background isn't traditional, but I've
        built up a portfolio through raw persistence, creative problem solving, and a genuine
        passion for coding.
      </p>
      <p className="text-md text-secondary mb-4 max-w-2xl text-center">
        I enjoy exploring the technical depths of systems — whether it's reverse-engineering game
        memory to build real-time overlays, crafting AI models from scratch, or writing clean,
        efficient tools that make my own life easier. I don't just build to build — I build because
        I want to understand.
      </p>
      <p className="text-md text-secondary mb-4 max-w-2xl text-center">
        My approach is hands-on and iterative: I dive-deep, experiment, refactor, and constantly
        look for ways to improve my code and understanding. That mindset has helped me stay focused
        on growth, even when it's challenging.
      </p>
      <p className="text-md text-secondary mb-4 max-w-2xl text-center">
        Outside of coding, I enjoy gaming, metal music, animals, and nature, and I'm always looking
        for new ways to learn more and grow as a developer.
      </p>
      <p className="text-md text-secondary mb-8 max-w-2xl text-center">
        I'm currently looking for an internship or entry level position and am excited to connect
        with others who share my enthusiasm for technology, creativity, and lifelong learning.
      </p>
    </div>
  );
}
