import { Plugin } from 'vite';
import { PutObjectRequest as PutObjectRequest$1, S3ClientConfig } from '@aws-sdk/client-s3';
export { S3ClientConfig } from '@aws-sdk/client-s3';

declare type PutObjectRequest = Omit<PutObjectRequest$1, 'Body' | 'Key'>;
/**
 * Plugin options.
 */
interface Options {
    /**
     * A Pattern to match for excluded content.
     */
    exclude?: string | RegExp | Function | Array<string | RegExp | Function> | null;
    /**
     * A Pattern to match for included content.
     */
    include?: string | RegExp | Function | Array<string | RegExp | Function> | null;
    /**
     * Provide the namespace of uploaded files on S3
     */
    basePath?: string | null;
    /**
     * Options for upload options of S3ClientConfig
     */
    clientConfig: S3ClientConfig;
    /**
     * Provide upload options PutObjectRequest
     */
    uploadOptions: PutObjectRequest;
    /**
     * By default: `build.outDir`.
     */
    directory?: string | null;
}

declare function ViteS3(enabled: boolean, userOptions: Options): Plugin;

export { type Options, type PutObjectRequest, ViteS3 as S3Plugin, ViteS3 };
