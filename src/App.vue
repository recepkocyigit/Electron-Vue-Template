<template>
    <router-view />
</template>

<script setup>
window.api.onServerLog(msg => {
    console.log("%c[SERVER LOG]", "color: green", msg);
});

window.api.onServerError(msg => {
    console.error("%c[SERVER ERROR]", "color: red", msg);
});
</script>