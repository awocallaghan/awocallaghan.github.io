<template>
    <div class="post-preview">
        <a :href="project.url">
            <h3 class="post-title">{{ project.title }}</h3>
            <h4 class="post-subtitle">{{ project.description }}</h4>
            <em>{{ project.date }}</em>
            <br />
            <em>{{ tagList }}</em>
        </a>
    </div>
</template>

<script>
module.exports = {
    props: {
        project: {
            type: Object,
            validator: (project) => {
                let properties = [
                    'url',
                    'title',
                    'description',
                    'date',
                    'tags',
                    'type'
                ];
                let valid = true;
                let i = 0;
                while (valid && i < properties.length) {
                    valid = project.hasOwnProperty(properties[i]);
                    i++;
                }
                return valid;
            },
        },
    },
    computed: {
        /**
         * Get a list of tags as a string
         */
        tagList: function () {
            return this.project.tags.join(', ');
        }
    }
};
</script>