/*!
*   Fried Rice Theme (based on Hugo Theme Stack)
*
*   @original-author: Jimmy Cai
*   @author: svtter
*   @website: https://svtter.cn
*   @link: https://github.com/Svtter/Fried-Rice
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";
import { setupTTS } from "ts/tts";
import { setupPaginationJump } from './pagination';
import { setupCodeCopy } from './code-copy';

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        /**
         * v0-style mobile menu toggle
         */
        const menuToggle = document.getElementById('toggle-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

                menuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('show');

                menuToggle.setAttribute('aria-expanded', (!isExpanded).toString());
                mobileMenu.setAttribute('aria-hidden', isExpanded.toString());
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (!menuToggle.contains(target) && !mobileMenu.contains(target)) {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                }
            });

            // Close mobile menu when clicking a link
            const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                });
            });
        }

        /**
         * Tag filter functionality
         */
        const tagFilterPills = document.querySelectorAll('.tag-filter-pill');
        const articles = document.querySelectorAll('.article-list article');

        if (tagFilterPills.length > 0 && articles.length > 0) {
            tagFilterPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const selectedTag = pill.getAttribute('data-tag');

                    // Update active state
                    tagFilterPills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');

                    // Filter articles
                    articles.forEach(article => {
                        const articleTags = (article as HTMLElement).getAttribute('data-tags') || '';

                        if (selectedTag === 'all') {
                            // Show all articles
                            (article as HTMLElement).style.display = '';
                        } else {
                            // Show only articles with matching tag
                            const tagsArray = articleTags.split(',');
                            if (tagsArray.includes(selectedTag)) {
                                (article as HTMLElement).style.display = '';
                            } else {
                                (article as HTMLElement).style.display = 'none';
                            }
                        }
                    });
                });
            });
        }

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            setupSmoothAnchors();
            setupScrollspy();
            setupTTS();
            setupCodeCopy();
        }

        setupPaginationJump();

        new StackColorScheme(document.getElementById('dark-mode-toggle')!);
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;