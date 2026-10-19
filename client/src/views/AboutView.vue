<script setup>
const team = [
  { name: 'Gabriel Z. Escaño', role: 'Back-end Developer', initials: 'GZE' },
  { name: 'Andrei James G. Tuazon', role: 'Front-end Developer', initials: 'AGT' }
]
</script>

<template>
  <section>
    <div class="section-head">
      <h1>About SaloSpot</h1>
      <p>A simple restaurant directory built to make finding a place to eat easier.</p>
    </div>

    <div class="card">
      <h2>Why we built it</h2>
      <p class="muted">
        Finding a good restaurant often means jumping between social media pages, maps, and
        word of mouth. SaloSpot puts the basics in one place: the name, cuisine, address,
        rating, and contact number of each restaurant, with search and filters that make it
        quick to find what you are craving.
      </p>
    </div>

    <div class="home-section">
      <div class="section-head">
        <h2>What you can do</h2>
      </div>
      <div class="steps">
        <div class="card">
          <h3>Search</h3>
          <p class="muted">Find restaurants by name, cuisine, or address.</p>
        </div>
        <div class="card">
          <h3>Filter and sort</h3>
          <p class="muted">Narrow by cuisine and sort by name or rating.</p>
        </div>
        <div class="card">
          <h3>Browse by page</h3>
          <p class="muted">Results are paged, so the list stays fast and easy to scan.</p>
        </div>
      </div>
    </div>

    <div class="home-section">
      <div class="section-head">
        <h2>Built with the MEVN stack</h2>
      </div>
      <div class="steps">
        <div class="card">
          <h3>MongoDB</h3>
          <p class="muted">Stores the restaurant listings in the cloud on Atlas.</p>
        </div>
        <div class="card">
          <h3>Express</h3>
          <p class="muted">Provides the API that serves and manages the data.</p>
        </div>
        <div class="card">
          <h3>Vue</h3>
          <p class="muted">Powers the pages and navigation you see.</p>
        </div>
        <div class="card">
          <h3>Node.js</h3>
          <p class="muted">Runs the server behind the application.</p>
        </div>
      </div>
    </div>

    <div class="home-section">
      <div class="section-head">
        <h2>Meet the team</h2>
        <p>The students behind SaloSpot.</p>
      </div>
      <div class="steps">
        <div v-for="member in team" :key="member.name" class="card team-card">
          <div class="avatar">{{ member.initials }}</div>
          <h3>{{ member.name }}</h3>
          <p class="muted">{{ member.role }}</p>
        </div>
      </div>
    </div>

    <div class="home-section">
      <div class="card">
        <h2>Managing listings</h2>
        <p class="muted">
          Restaurant listings are added, edited, and removed by the site administrators
          only, so the information stays accurate and consistent.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-card {
  text-align: center;
}

.team-card p {
  margin: 0;
}

.avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
}
</style>