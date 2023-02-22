import fs from 'fs'; /* fs is a Node.js module that let's you read files from the file system. */
import path from 'path'; /* path is a Node.js module that let's you manipulate file paths. */
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'data');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the ID.
        return {
            id,
            ...matterResult.data,
        };
    });
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    /* return an array like this:
        [{params: {id: 'blog-post-id-1'}},
         {params: {id: 'blog-post-id-2'}},]
       Each object must have the 'params' key and contain an
       object with the 'id' key (because the file for the 
       dynamic route is [id].tsx). Otherwise, getStaticPaths
       will fail.
    */
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // use gray-matter the parse the metadata section in the md file
    const matterResult = matter(fileContents);

    // Combine the data with the ID.
    return {
        id,
        ...matterResult.data,
    };
}