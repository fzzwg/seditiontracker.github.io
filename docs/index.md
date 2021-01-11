---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

{% for suspect in site.suspects %}
  <h2>{{ suspect.name }}</h2>
  [Details]({{suspect.url}})
{% endfor %}
