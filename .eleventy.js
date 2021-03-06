const pluginNavigation = require("@11ty/eleventy-navigation");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const slugify = require("slugify");

// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

module.exports = config => {
  config.setDataDeepMerge(true);

  // Add filters

  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(pluginNavigation);

  // Returns work items, sorted by display order
  config.addCollection('socialLinks', collection => {
    return sortByDisplayOrder(collection.getFilteredByGlob('./src/links/*.md'));
  });

  // Returns work items, sorted by display order
  config.addCollection('work', collection => {
    return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md'));
  });
    
    // Returns work items, sorted by display order then filtered by featured
    config.addCollection('featuredWork', collection => {
      return sortByDisplayOrder(
        collection.getFilteredByGlob('./src/work/*.md')
      ).filter(x => x.data.featured);
    });

  // Returns a collection of blog posts in reverse date order
  config.addCollection('blog', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/css");
  config.addPassthroughCopy('src/admin')
  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};