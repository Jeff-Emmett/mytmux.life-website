<script lang="ts">
    // About page for Shawn Anderson
</script>

<div class="container px-4 py-20 max-w-4xl mx-auto">
    <div class="flex flex-col md:flex-row gap-12 items-start">
        
        <!-- Profile Image Section -->
        <div class="w-full md:w-1/3 relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
                <img 
                    src="/placeholder.svg?height=400&width=400" 
                    alt="Shawn Anderson" 
                    class="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div class="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center border-t border-border">
                    <p class="text-xs font-mono text-primary">CEO @ LONG_TAIL_FINANCIAL</p>
                </div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="flex-1 space-y-8">
            <div>
                <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Shawn <span class="text-primary">Anderson</span>
                </h1>
                <p class="text-xl text-muted-foreground leading-relaxed">
                    Data Shaman, Educator, and Technologist.
                </p>
            </div>

            <div class="space-y-6 text-muted-foreground">
                <p>
                    As the Founder of <strong class="text-foreground">Long Tail Financial</strong>, Shawn operates at the intersection of data science, artificial intelligence, and decentralized finance. His work focuses on developing systems that enable exposure to the singularity—building the infrastructure for the next generation of financial technology.
                </p>
                
                <p>
                    Beyond the code, Shawn is deeply passionate about <strong class="text-foreground">teaching and self-empowerment</strong>. He believes that mastering your tools—like the terminal and tmux—is the first step towards mastering your craft. By understanding the systems we work with, we unlock the potential to build things that were previously impossible.
                </p>

                <div class="p-4 border-l-2 border-primary bg-primary/5 my-6">
                    <p class="italic text-foreground">
                        "Coding is not just about writing syntax; it's about structuring your thoughts and empowering yourself to create change in the digital world."
                    </p>
                </div>

                <p>
                    Whether he's leading workshops on AI in cryptocurrency markets or architecting complex tokenomics systems, Shawn's mission remains the same: to empower others through knowledge and technology.
                </p>
            </div>

            <!-- Social / Links -->
            <div class="flex gap-4 pt-4">
                <a href="https://www.longtailfinancial.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Long Tail Financial
                </a>
                <a href="https://github.com/shawnwanderson" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    GitHub
                </a>
            </div>
        </div>
    </div>
</div>
