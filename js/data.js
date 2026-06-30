const POSTS = [
  {
    id: 1,
    title: "The Quiet Power of Whitespace",
    excerpt: "Why empty space is the most underrated tool in a designer's kit, and how restraint builds trust.",
    category: "Design",
    author: "Maya Chen",
    date: "2026-06-12",
    readTime: 6,
    image: "https://picsum.photos/seed/whitespace/800/500",
    content: `
      <p>We tend to think of design as the act of adding: a color here, a button there, another banner to catch the eye. But the most confident design decisions are often about what you leave out. Whitespace, the empty area between and around elements, is not wasted space. It is the breathing room that lets ideas land.</p>

      <p>Walk into any well-designed space, a gallery, a quiet bookstore, a thoughtfully laid-out page, and you'll notice the same thing: nothing fights for your attention. Each element has room to exist. That calm is not an accident. It is engineered.</p>

      <h2>Space directs attention</h2>
      <p>When everything is emphasized, nothing is. Whitespace works by subtraction. By surrounding an element with emptiness, you signal its importance without raising your voice. A single headline on an otherwise bare page carries more weight than the same headline buried in clutter.</p>

      <blockquote>Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects.</blockquote>

      <p>Dieter Rams said that decades ago, and it still holds. Restraint reads as confidence. It tells the visitor: we know what matters here, and we're not going to make you hunt for it.</p>

      <h2>Whitespace builds trust</h2>
      <p>There's a reason premium brands favor generous margins and sparse layouts. Crowded design feels anxious, like a shop owner tugging at your sleeve. Spacious design feels assured. The unspoken message is that the work can stand on its own.</p>

      <p>A few principles that consistently help:</p>
      <ul>
        <li><strong>Give headings room to breathe</strong> with generous margins above and below.</li>
        <li><strong>Increase line height</strong> in body text so paragraphs don't feel dense.</li>
        <li><strong>Resist filling every gap</strong>, an empty corner is often doing real work.</li>
      </ul>

      <p>The next time a layout feels off, try removing something instead of adding. More often than not, the problem wasn't too little, it was too much.</p>`
  },
  {
    id: 2,
    title: "Writing Code That Reads Like Prose",
    excerpt: "Clarity is a feature. A look at naming, structure, and the empathy of readable code.",
    category: "Code",
    author: "Dev Patel",
    date: "2026-06-08",
    readTime: 8,
    image: "https://picsum.photos/seed/code/800/500",
    content: `
      <p>Code is read far more often than it is written. A line you write once may be read dozens of times, by teammates, by future maintainers, and by the most forgetful reader of all: you, six months from now. Writing code that reads like prose is an act of empathy toward all of them.</p>

      <h2>Name things like you mean it</h2>
      <p>A good name is documentation that never goes stale. Compare <code>d</code> with <code>daysUntilExpiry</code>. The first saves you a few keystrokes; the second saves the next reader a trip into the logic to figure out what you meant.</p>

      <blockquote>There are only two hard things in computer science: cache invalidation and naming things.</blockquote>

      <p>The joke endures because it's true. Naming is hard precisely because it forces you to understand what something actually does before you can describe it.</p>

      <h2>Structure is a story</h2>
      <p>Well-organized code reads top to bottom like a narrative. The high-level intent comes first, the messy details later. Functions should do one thing, and their names should tell you what that thing is. If you need a comment to explain what a function does, the function is probably trying to do too much.</p>

      <p>A few habits that pay off:</p>
      <ul>
        <li><strong>Keep functions short</strong>, if you can't see the whole thing at once, it's hard to trust.</li>
        <li><strong>Prefer clear over clever</strong>, the clever line you're proud of today is the bug you'll curse tomorrow.</li>
        <li><strong>Let names replace comments</strong> wherever possible.</li>
      </ul>

      <h2>Comments explain why, not what</h2>
      <p>Good code already says <em>what</em> it does. The thing it can't always say is <em>why</em>. Why this workaround? Why this threshold and not another? Those are the comments worth writing, the context that won't survive in the code itself.</p>

      <p>Readable code isn't slower to write once it becomes a habit. It's just code written with the next person in mind. And that person is usually you.</p>`
  },
  {
    id: 3,
    title: "On Building Things That Last",
    excerpt: "Durability over novelty. Lessons from craft, architecture, and slow software.",
    category: "Craft",
    author: "Lina Okafor",
    date: "2026-06-01",
    readTime: 5,
    image: "https://picsum.photos/seed/craft/800/500",
    content: `
      <p>We are obsessed with the new. Every week brings a fresh framework, a redesigned app, a louder promise. Yet the things we genuinely cherish, a worn leather bag, a tool that fits the hand, a building that has stood for a century, are almost always old. They lasted because someone built them to.</p>

      <h2>Durability is a decision</h2>
      <p>Nothing lasts by accident. Longevity is designed in from the start, in the choice of materials, in the care taken at the joints, in the refusal to cut the corner no one would notice. Quality is the sum of decisions made when it would have been easier to do less.</p>

      <blockquote>The bitterness of poor quality remains long after the sweetness of low cost is forgotten.</blockquote>

      <h2>Patience as a practice</h2>
      <p>Lasting work is rarely rushed. The craftsman who measures twice, the engineer who writes the test before the fix, the writer who lets a draft rest overnight, all are buying durability with patience. Speed feels productive, but haste leaves debts that compound.</p>

      <p>This applies to software as much as furniture. The codebase that survives is not the one written fastest, but the one written so it can be understood and changed years later.</p>

      <p>Building to last is, in the end, a kind of respect, for the materials, for the people who'll use the thing, and for the future self who'll have to maintain it. It costs more now. It almost always pays off later.</p>`
  },
  {
    id: 4,
    title: "The Art of the First Sentence",
    excerpt: "How great writers earn the second sentence, and why your opening line matters most.",
    category: "Writing",
    author: "Maya Chen",
    date: "2026-05-24",
    readTime: 4,
    image: "https://picsum.photos/seed/writing/800/500",
    content: `
      <p>The first sentence has exactly one job: to make you read the second. It doesn't need to summarize the piece, dazzle with vocabulary, or explain everything at once. It needs to create a small, irresistible pull forward.</p>

      <h2>Open a loop</h2>
      <p>The best openings raise a question the reader needs answered. They introduce a tension, a surprise, or a promise, and then withhold just enough to keep you moving. Curiosity, not information, is what turns the page.</p>

      <blockquote>The first sentence can't be written until the final sentence is written.</blockquote>

      <p>Joyce Carol Oates meant that the opening is a promise about the whole. You often can't craft it properly until you know where the piece is going. Many writers write their first line last.</p>

      <h2>Cut the throat-clearing</h2>
      <p>Most weak openings are warm-ups: throat-clearing the writer needed but the reader doesn't. The fix is usually brutal and simple, delete the first paragraph. More often than not, the real beginning was hiding underneath it all along.</p>

      <p>So write boldly, then cut without mercy. Earn the second sentence, and the rest will follow.</p>`
  },
  {
    id: 5,
    title: "Designing for Dark Mode (Properly)",
    excerpt: "It's not just inverting colors. A practical guide to contrast, depth, and comfort.",
    category: "Design",
    author: "Dev Patel",
    date: "2026-05-18",
    readTime: 7,
    image: "https://picsum.photos/seed/darkmode/800/500",
    content: `
      <p>Dark mode done poorly is worse than no dark mode at all. Flip a few colors, invert black and white, and you'll get something that technically works and genuinely hurts to look at. Real dark mode is a redesign, not a switch.</p>

      <h2>Avoid pure black</h2>
      <p>Pure black backgrounds with pure white text create harsh contrast that strains the eyes, especially in low light. Soften both ends. A dark charcoal background with an off-white text color is far more comfortable and feels more refined.</p>

      <blockquote>Dark mode isn't the absence of light. It's a different lighting design.</blockquote>

      <h2>Rethink depth and shadows</h2>
      <p>In light mode, shadows imply elevation. In dark mode, shadows nearly disappear, so you have to signal depth another way, usually with lighter surface colors. Elements that sit "higher" get slightly lighter, not darker.</p>

      <p>A practical checklist:</p>
      <ul>
        <li><strong>Desaturate your accent colors</strong> slightly, vivid hues vibrate against dark backgrounds.</li>
        <li><strong>Use elevation through lightness</strong>, raise surfaces by lightening them, not shadowing them.</li>
        <li><strong>Test real content</strong> in real lighting, not just your design tool.</li>
      </ul>

      <h2>Let users choose</h2>
      <p>Some people love dark mode; others find it harder to read. Respect the system preference by default, but always give a manual toggle, and remember the choice. Comfort is personal, and the kindest design lets people set their own.</p>`
  },
  {
    id: 6,
    title: "Slow Software in a Fast World",
    excerpt: "What if the best tools aren't the fastest to ship, but the kindest to use?",
    category: "Craft",
    author: "Lina Okafor",
    date: "2026-05-10",
    readTime: 6,
    image: "https://picsum.photos/seed/slow/800/500",
    content: `
      <p>Speed is seductive. Ship fast, move fast, grow fast. But speed without intention is just noise, and a great deal of modern software is loud, restless, and exhausting to use. There is a quieter alternative.</p>

      <h2>What "slow software" means</h2>
      <p>Slow software isn't sluggish software. It's software made with the patience to get the details right, tools that respect your attention rather than competing for it. No dark patterns, no manufactured urgency, no endless notifications. Just a thing that does its job well and then gets out of the way.</p>

      <blockquote>The tools we use shape the way we think. Calm tools make for calm minds.</blockquote>

      <h2>Designing for calm</h2>
      <p>Calm software shares a few traits:</p>
      <ul>
        <li><strong>It is predictable</strong>, it behaves the same way every time.</li>
        <li><strong>It is quiet</strong>, it interrupts only when it truly matters.</li>
        <li><strong>It is finished</strong>, it doesn't constantly demand you relearn it.</li>
      </ul>

      <p>None of this means stagnation. It means change is deliberate, earned, and in service of the person using the tool, not the metrics on a dashboard.</p>

      <p>In a world optimizing for engagement, building something that respectfully steps back is almost radical. But the tools we end up loving are rarely the loudest. They're the ones that quietly, reliably, work.</p>`
  }
];

// Helpers shared across pages
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function postUrl(id) { return `post.html?id=${id}`; }
