"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const AkairoModule_1 = __importDefault(require("../AkairoModule"));
const Argument_1 = __importDefault(require("./arguments/Argument"));
const ArgumentRunner_1 = __importDefault(require("./arguments/ArgumentRunner"));
const ContentParser_1 = __importDefault(require("./ContentParser"));
/**
 * Represents a command.
 * @param id - Command ID.
 * @param options - Options for the command.
 */
class Command extends AkairoModule_1.default {
    constructor(id, options) {
        super(id, { category: options.category });
        const { onlyNsfw = false, aliases = [], 
        // @ts-expect-error: otherwise generator functions break
        args = this.args || [], quoted = true, separator, channel = null, ownerOnly = false, superUserOnly = false, editable = true, typing = false, cooldown = null, ratelimit = 1, argumentDefaults = {}, description = "", prefix = this.prefix, clientPermissions = this.clientPermissions, userPermissions = this.userPermissions, regex = this.regex, 
        // @ts-expect-error
        condition = this.condition || (() => false), before = this.before || (() => undefined), lock, ignoreCooldown, ignorePermissions, flags = [], optionFlags = [], slash = false, slashOptions, slashEphemeral = false, slashGuilds = [] } = options;
        this.aliases = aliases ?? [];
        const { flagWords, optionFlagWords } = Array.isArray(args)
            ? ContentParser_1.default.getFlags(args)
            : { flagWords: flags, optionFlagWords: optionFlags };
        this.contentParser = new ContentParser_1.default({
            flagWords,
            optionFlagWords,
            quoted,
            separator
        });
        this.argumentRunner = new ArgumentRunner_1.default(this);
        this.argumentGenerator = Array.isArray(args)
            ? ArgumentRunner_1.default.fromArguments(
            // @ts-expect-error
            args.map(arg => [arg.id, new Argument_1.default(this, arg)]))
            : args.bind(this);
        this.onlyNsfw = Boolean(onlyNsfw);
        this.channel = channel;
        this.ownerOnly = Boolean(ownerOnly);
        this.superUserOnly = Boolean(superUserOnly);
        this.editable = Boolean(editable);
        this.typing = Boolean(typing);
        this.cooldown = cooldown;
        this.ratelimit = ratelimit;
        this.argumentDefaults = argumentDefaults;
        this.description = Array.isArray(description) ? description.join("\n") : description;
        this.prefix = typeof prefix === "function" ? prefix.bind(this) : prefix;
        this.clientPermissions = typeof clientPermissions === "function" ? clientPermissions.bind(this) : clientPermissions;
        this.userPermissions = typeof userPermissions === "function" ? userPermissions.bind(this) : userPermissions;
        this.regex = typeof regex === "function" ? regex.bind(this) : regex;
        this.condition = condition.bind(this);
        this.before = before.bind(this);
        this.lock = lock;
        if (typeof lock === "string") {
            this.lock = {
                guild: (message) => message.guild && message.guild.id,
                channel: (message) => message.channel.id,
                user: (message) => message.author.id
            }[lock];
        }
        if (this.lock) {
            this.locker = new Set();
        }
        this.ignoreCooldown = typeof ignoreCooldown === "function" ? ignoreCooldown.bind(this) : ignoreCooldown;
        this.ignorePermissions = typeof ignorePermissions === "function" ? ignorePermissions.bind(this) : ignorePermissions;
        this.slashOptions = slashOptions;
        this.slashEphemeral = slashEphemeral;
        this.slash = slash;
        this.slashGuilds = slashGuilds;
    }
    /**
     * Command names.
     */
    aliases;
    /**
     * Default prompt options.
     */
    argumentDefaults;
    /**
     * Usable only in this channel type.
     */
    channel;
    /**
     * Permissions required to run command by the client.
     */
    clientPermissions;
    /**
     * Cooldown in milliseconds.
     */
    cooldown;
    /**
     * Description of the command.
     */
    description;
    /**
     * Whether or not this command can be ran by an edit.
     */
    editable;
    /**
     * ID of user(s) to ignore cooldown or a function to ignore.
     */
    ignoreCooldown;
    /**
     * ID of user(s) to ignore `userPermissions` checks or a function to ignore.
     */
    ignorePermissions;
    /**
     * The key supplier for the locker.
     */
    lock;
    /**
     * Stores the current locks.
     */
    locker;
    /**
     * Whether or not the command can only be run in  NSFW channels.
     */
    onlyNsfw;
    /**
     * Usable only by the client owner.
     */
    ownerOnly;
    /**
     * Command prefix overwrite.
     */
    prefix;
    /**
     * Whether or not to consider quotes.
     */
    quoted;
    /**
     * Uses allowed before cooldown.
     */
    ratelimit;
    /**
     * The regex trigger for this command.
     */
    regex;
    /**
     * Mark command as slash command and set information.
     */
    slash;
    /**
     * Whether slash command responses for this command should be ephemeral or not.
     */
    slashEphemeral;
    /**
     * Assign slash commands to Specific guilds. This option will make the commands not register globally, but only in the chosen servers.
     */
    slashGuilds;
    /**
     * Options for using the slash command.
     */
    slashOptions;
    /**
     * Whether or not to allow client superUsers(s) only.
     */
    superUserOnly;
    /**
     * Whether or not to type during command execution.
     */
    typing;
    /**
     * Permissions required to run command by the user.
     */
    userPermissions;
    /**
     * Argument options or generator.
     */
    // public args: ArgumentOptions[] | ArgumentGenerator;
    /**
     * The content parser.
     */
    contentParser;
    /**
     * The argument runner.
     */
    argumentRunner;
    /**
     * Generator for arguments.
     */
    argumentGenerator;
    /**
     * Executes the command.
     * @param message - Message that triggered the command.
     * @param args - Evaluated arguments.
     */
    /* public exec(message: Message, args: any): any; */
    exec(message, args) {
        throw new AkairoError_1.default("NOT_IMPLEMENTED", this.constructor.name, "exec");
    }
    /**
     * Runs before argument parsing and execution.
     * @param message - Message being handled.
     */
    before(message) { }
    /**
     * Checks if the command should be ran by using an arbitrary condition.
     * @param message - Message being handled.
     */
    // @ts-expect-error
    condition(message) { }
    /**
     * Execute the slash command
     * @param message - Message for slash command
     * @param args - Slash command options
     */
    execSlash(message, ...args) {
        if (this.slash) {
            throw new AkairoError_1.default("NOT_IMPLEMENTED", this.constructor.name, "execSlash");
        }
    }
    /**
     * Parses content using the command's arguments.
     * @param message - Message to use.
     * @param content - String to parse.
     */
    parse(message, content) {
        const parsed = this.contentParser.parse(content);
        return this.argumentRunner.run(message, parsed, this.argumentGenerator);
    }
    /**
     * Reloads the command.
     */
    reload() {
        return super.reload();
    }
    /**
     * Removes the command.
     */
    remove() {
        return super.remove();
    }
}
exports.default = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdHJ1Y3QvY29tbWFuZHMvQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLHlFQUFpRDtBQUlqRCxtRUFBb0U7QUFDcEUsb0VBQXlGO0FBQ3pGLGdGQUFpRjtBQUVqRixvRUFBcUU7QUFHckU7Ozs7R0FJRztBQUNILE1BQThCLE9BQVEsU0FBUSxzQkFBWTtJQUN6RCxZQUFZLEVBQVUsRUFBRSxPQUF1QjtRQUM5QyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sRUFDTCxRQUFRLEdBQUcsS0FBSyxFQUNoQixPQUFPLEdBQUcsRUFBRTtRQUNaLHdEQUF3RDtRQUN4RCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQ3RCLE1BQU0sR0FBRyxJQUFJLEVBQ2IsU0FBUyxFQUNULE9BQU8sR0FBRyxJQUFJLEVBQ2QsU0FBUyxHQUFHLEtBQUssRUFDakIsYUFBYSxHQUFHLEtBQUssRUFDckIsUUFBUSxHQUFHLElBQUksRUFDZixNQUFNLEdBQUcsS0FBSyxFQUNkLFFBQVEsR0FBRyxJQUFJLEVBQ2YsU0FBUyxHQUFHLENBQUMsRUFDYixnQkFBZ0IsR0FBRyxFQUFFLEVBQ3JCLFdBQVcsR0FBRyxFQUFFLEVBQ2hCLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUNwQixpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQzFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUN0QyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFDbEIsbUJBQW1CO1FBQ25CLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQzNDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJ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LG9EQUFvRDtJQUM3QyxJQUFJLENBQUMsT0FBZ0MsRUFBRSxJQUFTO1FBQ3RELE1BQU0sSUFBSSxxQkFBVyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsT0FBZ0IsSUFBUSxDQUFDO0lBRXZDOzs7T0FHRztJQUNILG1CQUFtQjtJQUNaLFNBQVMsQ0FBQyxPQUFnQixJQUErQixDQUFDO0lBRWpFOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsT0FBc0IsRUFBRSxHQUFHLElBQVc7UUFDdEQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsTUFBTSxJQUFJLHFCQUFXLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDN0U7SUFDRixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQWU7UUFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7T0FFRztJQUNhLE1BQU07UUFDckIsT0FBTyxLQUFLLENBQUMsTUFBTSxFQUFhLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ2EsTUFBTTtRQUNyQixPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQWEsQ0FBQztJQUNsQyxDQUFDO0NBQ0Q7QUFwVkQsMEJBb1ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyogIGVzbGludC1kaXNhYmxlIGZ1bmMtbmFtZXMsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db21tYW5kT3B0aW9uRGF0YSwgTWVzc2FnZSwgUGVybWlzc2lvblJlc29sdmFibGUsIFNub3dmbGFrZSB9IGZyb20gXCJkaXNjb3JkLmpzXCI7XG5pbXBvcnQgQWthaXJvRXJyb3IgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvRXJyb3JcIjtcbmltcG9ydCBBa2Fpcm9NZXNzYWdlIGZyb20gXCIuLi8uLi91dGlsL0FrYWlyb01lc3NhZ2VcIjtcbmltcG9ydCBDYXRlZ29yeSBmcm9tIFwiLi4vLi4vdXRpbC9DYXRlZ29yeVwiO1xuaW1wb3J0IEFrYWlyb0NsaWVudCBmcm9tIFwiLi4vQWthaXJvQ2xpZW50XCI7XG5pbXBvcnQgQWthaXJvTW9kdWxlLCB7IEFrYWlyb01vZHVsZU9wdGlvbnMgfSBmcm9tIFwiLi4vQWthaXJvTW9kdWxlXCI7XG5pbXBvcnQgQXJndW1lbnQsIHsgQXJndW1lbnRPcHRpb25zLCBEZWZhdWx0QXJndW1lbnRPcHRpb25zIH0gZnJvbSBcIi4vYXJndW1lbnRzL0FyZ3VtZW50XCI7XG5pbXBvcnQgQXJndW1lbnRSdW5uZXIsIHsgQXJndW1lbnRSdW5uZXJTdGF0ZSB9IGZyb20gXCIuL2FyZ3VtZW50cy9Bcmd1bWVudFJ1bm5lclwiO1xuaW1wb3J0IENvbW1hbmRIYW5kbGVyLCB7IElnbm9yZUNoZWNrUHJlZGljYXRlLCBQcmVmaXhTdXBwbGllciB9IGZyb20gXCIuL0NvbW1hbmRIYW5kbGVyXCI7XG5pbXBvcnQgQ29udGVudFBhcnNlciwgeyBDb250ZW50UGFyc2VyUmVzdWx0IH0gZnJvbSBcIi4vQ29udGVudFBhcnNlclwiO1xuaW1wb3J0IEZsYWcgZnJvbSBcIi4vRmxhZ1wiO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb21tYW5kLlxuICogQHBhcmFtIGlkIC0gQ29tbWFuZCBJRC5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIGNvbW1hbmQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIENvbW1hbmQgZXh0ZW5kcyBBa2Fpcm9Nb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zOiBDb21tYW5kT3B0aW9ucykge1xuXHRcdHN1cGVyKGlkLCB7IGNhdGVnb3J5OiBvcHRpb25zLmNhdGVnb3J5IH0pO1xuXG5cdFx0Y29uc3Qge1xuXHRcdFx0b25seU5zZncgPSBmYWxzZSxcblx0XHRcdGFsaWFzZXMgPSBbXSxcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3I6IG90aGVyd2lzZSBnZW5lcmF0b3IgZnVuY3Rpb25zIGJyZWFrXG5cdFx0XHRhcmdzID0gdGhpcy5hcmdzIHx8IFtdLFxuXHRcdFx0cXVvdGVkID0gdHJ1ZSxcblx0XHRcdHNlcGFyYXRvcixcblx0XHRcdGNoYW5uZWwgPSBudWxsLFxuXHRcdFx0b3duZXJPbmx5ID0gZmFsc2UsXG5cdFx0XHRzdXBlclVzZXJPbmx5ID0gZmFsc2UsXG5cdFx0XHRlZGl0YWJsZSA9IHRydWUsXG5cdFx0XHR0eXBpbmcgPSBmYWxzZSxcblx0XHRcdGNvb2xkb3duID0gbnVsbCxcblx0XHRcdHJhdGVsaW1pdCA9IDEsXG5cdFx0XHRhcmd1bWVudERlZmF1bHRzID0ge30sXG5cdFx0XHRkZXNjcmlwdGlvbiA9IFwiXCIsXG5cdFx0XHRwcmVmaXggPSB0aGlzLnByZWZpeCxcblx0XHRcdGNsaWVudFBlcm1pc3Npb25zID0gdGhpcy5jbGllbnRQZXJtaXNzaW9ucyxcblx0XHRcdHVzZXJQZXJtaXNzaW9ucyA9IHRoaXMudXNlclBlcm1pc3Npb25zLFxuXHRcdFx0cmVnZXggPSB0aGlzLnJlZ2V4LFxuXHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxuXHRcdFx0Y29uZGl0aW9uID0gdGhpcy5jb25kaXRpb24gfHwgKCgpID0+IGZhbHNlKSxcblx0XHRcdGJlZm9yZSA9IHRoaXMuYmVmb3JlIHx8ICgoKSA9PiB1bmRlZmluZWQpLFxuXHRcdFx0bG9jayxcblx0XHRcdGlnbm9yZUNvb2xkb3duLFxuXHRcdFx0aWdub3JlUGVybWlzc2lvbnMsXG5cdFx0XHRmbGFncyA9IFtdLFxuXHRcdFx0b3B0aW9uRmxhZ3MgPSBbXSxcblx0XHRcdHNsYXNoID0gZmFsc2UsXG5cdFx0XHRzbGFzaE9wdGlvbnMsXG5cdFx0XHRzbGFzaEVwaGVtZXJhbCA9IGZhbHNlLFxuXHRcdFx0c2xhc2hHdWlsZHMgPSBbXVxuXHRcdH06IENvbW1hbmRPcHRpb25zID0gb3B0aW9ucztcblxuXHRcdHRoaXMuYWxpYXNlcyA9IGFsaWFzZXMgPz8gW107XG5cblx0XHRjb25zdCB7IGZsYWdXb3Jkcywgb3B0aW9uRmxhZ1dvcmRzIH0gPSBBcnJheS5pc0FycmF5KGFyZ3MpXG5cdFx0XHQ/IENvbnRlbnRQYXJzZXIuZ2V0RmxhZ3MoYXJncylcblx0XHRcdDogeyBmbGFnV29yZHM6IGZsYWdzLCBvcHRpb25GbGFnV29yZHM6IG9wdGlvbkZsYWdzIH07XG5cblx0XHR0aGlzLmNvbnRlbnRQYXJzZXIgPSBuZXcgQ29udGVudFBhcnNlcih7XG5cdFx0XHRmbGFnV29yZHMsXG5cdFx0XHRvcHRpb25GbGFnV29yZHMsXG5cdFx0XHRxdW90ZWQsXG5cdFx0XHRzZXBhcmF0b3Jcblx0XHR9KTtcblxuXHRcdHRoaXMuYXJndW1lbnRSdW5uZXIgPSBuZXcgQXJndW1lbnRSdW5uZXIodGhpcyk7XG5cdFx0dGhpcy5hcmd1bWVudEdlbmVyYXRvciA9IEFycmF5LmlzQXJyYXkoYXJncylcblx0XHRcdD8gQXJndW1lbnRSdW5uZXIuZnJvbUFyZ3VtZW50cyhcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXG5cdFx0XHRcdFx0YXJncy5tYXAoYXJnID0+IFthcmcuaWQsIG5ldyBBcmd1bWVudCh0aGlzLCBhcmcpXSlcblx0XHRcdCAgKVxuXHRcdFx0OiBhcmdzLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9ubHlOc2Z3ID0gQm9vbGVhbihvbmx5TnNmdyk7XG5cblx0XHR0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuXG5cdFx0dGhpcy5vd25lck9ubHkgPSBCb29sZWFuKG93bmVyT25seSk7XG5cblx0XHR0aGlzLnN1cGVyVXNlck9ubHkgPSBCb29sZWFuKHN1cGVyVXNlck9ubHkpO1xuXG5cdFx0dGhpcy5lZGl0YWJsZSA9IEJvb2xlYW4oZWRpdGFibGUpO1xuXG5cdFx0dGhpcy50eXBpbmcgPSBCb29sZWFuKHR5cGluZyk7XG5cblx0XHR0aGlzLmNvb2xkb3duID0gY29vbGRvd247XG5cblx0XHR0aGlzLnJhdGVsaW1pdCA9IHJhdGVsaW1pdDtcblxuXHRcdHRoaXMuYXJndW1lbnREZWZhdWx0cyA9IGFyZ3VtZW50RGVmYXVsdHM7XG5cblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gQXJyYXkuaXNBcnJheShkZXNjcmlwdGlvbikgPyBkZXNjcmlwdGlvbi5qb2luKFwiXFxuXCIpIDogZGVzY3JpcHRpb247XG5cblx0XHR0aGlzLnByZWZpeCA9IHR5cGVvZiBwcmVmaXggPT09IFwiZnVuY3Rpb25cIiA/IHByZWZpeC5iaW5kKHRoaXMpIDogcHJlZml4O1xuXG5cdFx0dGhpcy5jbGllbnRQZXJtaXNzaW9ucyA9IHR5cGVvZiBjbGllbnRQZXJtaXNzaW9ucyA9PT0gXCJmdW5jdGlvblwiID8gY2xpZW50UGVybWlzc2lvbnMuYmluZCh0aGlzKSA6IGNsaWVudFBlcm1pc3Npb25zO1xuXG5cdFx0dGhpcy51c2VyUGVybWlzc2lvbnMgPSB0eXBlb2YgdXNlclBlcm1pc3Npb25zID09PSBcImZ1bmN0aW9uXCIgPyB1c2VyUGVybWlzc2lvbnMuYmluZCh0aGlzKSA6IHVzZXJQZXJtaXNzaW9ucztcblxuXHRcdHRoaXMucmVnZXggPSB0eXBlb2YgcmVnZXggPT09IFwiZnVuY3Rpb25cIiA/IHJlZ2V4LmJpbmQodGhpcykgOiByZWdleDtcblxuXHRcdHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLmJlZm9yZSA9IGJlZm9yZS5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5sb2NrID0gbG9jaztcblxuXHRcdGlmICh0eXBlb2YgbG9jayA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dGhpcy5sb2NrID0ge1xuXHRcdFx0XHRndWlsZDogKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG1lc3NhZ2UuZ3VpbGQgJiYgbWVzc2FnZS5ndWlsZC5pZCxcblx0XHRcdFx0Y2hhbm5lbDogKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG1lc3NhZ2UuY2hhbm5lbC5pZCxcblx0XHRcdFx0dXNlcjogKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG1lc3NhZ2UuYXV0aG9yLmlkXG5cdFx0XHR9W2xvY2tdO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmxvY2spIHtcblx0XHRcdHRoaXMubG9ja2VyID0gbmV3IFNldCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuaWdub3JlQ29vbGRvd24gPSB0eXBlb2YgaWdub3JlQ29vbGRvd24gPT09IFwiZnVuY3Rpb25cIiA/IGlnbm9yZUNvb2xkb3duLmJpbmQodGhpcykgOiBpZ25vcmVDb29sZG93bjtcblxuXHRcdHRoaXMuaWdub3JlUGVybWlzc2lvbnMgPSB0eXBlb2YgaWdub3JlUGVybWlzc2lvbnMgPT09IFwiZnVuY3Rpb25cIiA/IGlnbm9yZVBlcm1pc3Npb25zLmJpbmQodGhpcykgOiBpZ25vcmVQZXJtaXNzaW9ucztcblxuXHRcdHRoaXMuc2xhc2hPcHRpb25zID0gc2xhc2hPcHRpb25zO1xuXG5cdFx0dGhpcy5zbGFzaEVwaGVtZXJhbCA9IHNsYXNoRXBoZW1lcmFsO1xuXG5cdFx0dGhpcy5zbGFzaCA9IHNsYXNoO1xuXG5cdFx0dGhpcy5zbGFzaEd1aWxkcyA9IHNsYXNoR3VpbGRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbW1hbmQgbmFtZXMuXG5cdCAqL1xuXHRwdWJsaWMgYWxpYXNlczogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgcHJvbXB0IG9wdGlvbnMuXG5cdCAqL1xuXHRwdWJsaWMgYXJndW1lbnREZWZhdWx0czogRGVmYXVsdEFyZ3VtZW50T3B0aW9ucztcblxuXHQvKipcblx0ICogQ2F0ZWdvcnkgdGhlIGNvbW1hbmQgYmVsb25ncyB0by5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNhdGVnb3J5OiBDYXRlZ29yeTxzdHJpbmcsIENvbW1hbmQ+O1xuXG5cdC8qKlxuXHQgKiBVc2FibGUgb25seSBpbiB0aGlzIGNoYW5uZWwgdHlwZS5cblx0ICovXG5cdHB1YmxpYyBjaGFubmVsPzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgQWthaXJvIGNsaWVudC5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsaWVudDogQWthaXJvQ2xpZW50O1xuXG5cdC8qKlxuXHQgKiBQZXJtaXNzaW9ucyByZXF1aXJlZCB0byBydW4gY29tbWFuZCBieSB0aGUgY2xpZW50LlxuXHQgKi9cblx0cHVibGljIGNsaWVudFBlcm1pc3Npb25zOiBQZXJtaXNzaW9uUmVzb2x2YWJsZSB8IFBlcm1pc3Npb25SZXNvbHZhYmxlW10gfCBNaXNzaW5nUGVybWlzc2lvblN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBDb29sZG93biBpbiBtaWxsaXNlY29uZHMuXG5cdCAqL1xuXHRwdWJsaWMgY29vbGRvd24/OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIERlc2NyaXB0aW9uIG9mIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIGRlc2NyaXB0aW9uOiBhbnk7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRoaXMgY29tbWFuZCBjYW4gYmUgcmFuIGJ5IGFuIGVkaXQuXG5cdCAqL1xuXHRwdWJsaWMgZWRpdGFibGU6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBmaWxlcGF0aC5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGZpbGVwYXRoOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBoYW5kbGVyLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgaGFuZGxlcjogQ29tbWFuZEhhbmRsZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBJRCBvZiB0aGUgY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGlkOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIElEIG9mIHVzZXIocykgdG8gaWdub3JlIGNvb2xkb3duIG9yIGEgZnVuY3Rpb24gdG8gaWdub3JlLlxuXHQgKi9cblx0cHVibGljIGlnbm9yZUNvb2xkb3duPzogU25vd2ZsYWtlIHwgU25vd2ZsYWtlW10gfCBJZ25vcmVDaGVja1ByZWRpY2F0ZTtcblxuXHQvKipcblx0ICogSUQgb2YgdXNlcihzKSB0byBpZ25vcmUgYHVzZXJQZXJtaXNzaW9uc2AgY2hlY2tzIG9yIGEgZnVuY3Rpb24gdG8gaWdub3JlLlxuXHQgKi9cblx0cHVibGljIGlnbm9yZVBlcm1pc3Npb25zPzogU25vd2ZsYWtlIHwgU25vd2ZsYWtlW10gfCBJZ25vcmVDaGVja1ByZWRpY2F0ZTtcblxuXHQvKipcblx0ICogVGhlIGtleSBzdXBwbGllciBmb3IgdGhlIGxvY2tlci5cblx0ICovXG5cdHB1YmxpYyBsb2NrPzogS2V5U3VwcGxpZXIgfCBcImNoYW5uZWxcIiB8IFwiZ3VpbGRcIiB8IFwidXNlclwiO1xuXG5cdC8qKlxuXHQgKiBTdG9yZXMgdGhlIGN1cnJlbnQgbG9ja3MuXG5cdCAqL1xuXHRwdWJsaWMgbG9ja2VyPzogU2V0PHN0cmluZz47XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRoZSBjb21tYW5kIGNhbiBvbmx5IGJlIHJ1biBpbiAgTlNGVyBjaGFubmVscy5cblx0ICovXG5cdHB1YmxpYyBvbmx5TnNmdzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVXNhYmxlIG9ubHkgYnkgdGhlIGNsaWVudCBvd25lci5cblx0ICovXG5cdHB1YmxpYyBvd25lck9ubHk6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENvbW1hbmQgcHJlZml4IG92ZXJ3cml0ZS5cblx0ICovXG5cdHB1YmxpYyBwcmVmaXg/OiBzdHJpbmcgfCBzdHJpbmdbXSB8IFByZWZpeFN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBjb25zaWRlciBxdW90ZXMuXG5cdCAqL1xuXHRwdWJsaWMgcXVvdGVkOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBVc2VzIGFsbG93ZWQgYmVmb3JlIGNvb2xkb3duLlxuXHQgKi9cblx0cHVibGljIHJhdGVsaW1pdDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVnZXggdHJpZ2dlciBmb3IgdGhpcyBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIHJlZ2V4OiBSZWdFeHAgfCBSZWdleFN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBNYXJrIGNvbW1hbmQgYXMgc2xhc2ggY29tbWFuZCBhbmQgc2V0IGluZm9ybWF0aW9uLlxuXHQgKi9cblx0cHVibGljIHNsYXNoPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBzbGFzaCBjb21tYW5kIHJlc3BvbnNlcyBmb3IgdGhpcyBjb21tYW5kIHNob3VsZCBiZSBlcGhlbWVyYWwgb3Igbm90LlxuXHQgKi9cblx0cHVibGljIHNsYXNoRXBoZW1lcmFsPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQXNzaWduIHNsYXNoIGNvbW1hbmRzIHRvIFNwZWNpZmljIGd1aWxkcy4gVGhpcyBvcHRpb24gd2lsbCBtYWtlIHRoZSBjb21tYW5kcyBub3QgcmVnaXN0ZXIgZ2xvYmFsbHksIGJ1dCBvbmx5IGluIHRoZSBjaG9zZW4gc2VydmVycy5cblx0ICovXG5cdHB1YmxpYyBzbGFzaEd1aWxkcz86IFNub3dmbGFrZVtdO1xuXG5cdC8qKlxuXHQgKiBPcHRpb25zIGZvciB1c2luZyB0aGUgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBzbGFzaE9wdGlvbnM/OiBBcHBsaWNhdGlvbkNvbW1hbmRPcHRpb25EYXRhW107XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIGFsbG93IGNsaWVudCBzdXBlclVzZXJzKHMpIG9ubHkuXG5cdCAqL1xuXHRwdWJsaWMgc3VwZXJVc2VyT25seTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gdHlwZSBkdXJpbmcgY29tbWFuZCBleGVjdXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgdHlwaW5nOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBQZXJtaXNzaW9ucyByZXF1aXJlZCB0byBydW4gY29tbWFuZCBieSB0aGUgdXNlci5cblx0ICovXG5cdHB1YmxpYyB1c2VyUGVybWlzc2lvbnM6IFBlcm1pc3Npb25SZXNvbHZhYmxlIHwgUGVybWlzc2lvblJlc29sdmFibGVbXSB8IE1pc3NpbmdQZXJtaXNzaW9uU3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIEFyZ3VtZW50IG9wdGlvbnMgb3IgZ2VuZXJhdG9yLlxuXHQgKi9cblx0Ly8gcHVibGljIGFyZ3M6IEFyZ3VtZW50T3B0aW9uc1tdIHwgQXJndW1lbnRHZW5lcmF0b3I7XG5cblx0LyoqXG5cdCAqIFRoZSBjb250ZW50IHBhcnNlci5cblx0ICovXG5cdHB1YmxpYyBjb250ZW50UGFyc2VyOiBDb250ZW50UGFyc2VyO1xuXG5cdC8qKlxuXHQgKiBUaGUgYXJndW1lbnQgcnVubmVyLlxuXHQgKi9cblx0cHVibGljIGFyZ3VtZW50UnVubmVyOiBBcmd1bWVudFJ1bm5lcjtcblxuXHQvKipcblx0ICogR2VuZXJhdG9yIGZvciBhcmd1bWVudHMuXG5cdCAqL1xuXHRwdWJsaWMgYXJndW1lbnRHZW5lcmF0b3I6IEFyZ3VtZW50R2VuZXJhdG9yO1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB0aGUgY29tbWFuZC5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjb21tYW5kLlxuXHQgKiBAcGFyYW0gYXJncyAtIEV2YWx1YXRlZCBhcmd1bWVudHMuXG5cdCAqL1xuXHQvKiBwdWJsaWMgZXhlYyhtZXNzYWdlOiBNZXNzYWdlLCBhcmdzOiBhbnkpOiBhbnk7ICovXG5cdHB1YmxpYyBleGVjKG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlLCBhcmdzOiBhbnkpOiBhbnkge1xuXHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIk5PVF9JTVBMRU1FTlRFRFwiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIFwiZXhlY1wiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW5zIGJlZm9yZSBhcmd1bWVudCBwYXJzaW5nIGFuZCBleGVjdXRpb24uXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSBiZWluZyBoYW5kbGVkLlxuXHQgKi9cblx0cHVibGljIGJlZm9yZShtZXNzYWdlOiBNZXNzYWdlKTogYW55IHt9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY29tbWFuZCBzaG91bGQgYmUgcmFuIGJ5IHVzaW5nIGFuIGFyYml0cmFyeSBjb25kaXRpb24uXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSBiZWluZyBoYW5kbGVkLlxuXHQgKi9cblx0Ly8gQHRzLWV4cGVjdC1lcnJvclxuXHRwdWJsaWMgY29uZGl0aW9uKG1lc3NhZ2U6IE1lc3NhZ2UpOiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPiB7fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIHRoZSBzbGFzaCBjb21tYW5kXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSBmb3Igc2xhc2ggY29tbWFuZFxuXHQgKiBAcGFyYW0gYXJncyAtIFNsYXNoIGNvbW1hbmQgb3B0aW9uc1xuXHQgKi9cblx0cHVibGljIGV4ZWNTbGFzaChtZXNzYWdlOiBBa2Fpcm9NZXNzYWdlLCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG5cdFx0aWYgKHRoaXMuc2xhc2gpIHtcblx0XHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIk5PVF9JTVBMRU1FTlRFRFwiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIFwiZXhlY1NsYXNoXCIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgY29udGVudCB1c2luZyB0aGUgY29tbWFuZCdzIGFyZ3VtZW50cy5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHVzZS5cblx0ICogQHBhcmFtIGNvbnRlbnQgLSBTdHJpbmcgdG8gcGFyc2UuXG5cdCAqL1xuXHRwdWJsaWMgcGFyc2UobWVzc2FnZTogTWVzc2FnZSwgY29udGVudDogc3RyaW5nKTogUHJvbWlzZTxGbGFnIHwgYW55PiB7XG5cdFx0Y29uc3QgcGFyc2VkID0gdGhpcy5jb250ZW50UGFyc2VyLnBhcnNlKGNvbnRlbnQpO1xuXHRcdHJldHVybiB0aGlzLmFyZ3VtZW50UnVubmVyLnJ1bihtZXNzYWdlLCBwYXJzZWQsIHRoaXMuYXJndW1lbnRHZW5lcmF0b3IpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbG9hZHMgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVsb2FkKCk6IENvbW1hbmQge1xuXHRcdHJldHVybiBzdXBlci5yZWxvYWQoKSBhcyBDb21tYW5kO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVtb3ZlKCk6IENvbW1hbmQge1xuXHRcdHJldHVybiBzdXBlci5yZW1vdmUoKSBhcyBDb21tYW5kO1xuXHR9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byB1c2UgZm9yIGNvbW1hbmQgZXhlY3V0aW9uIGJlaGF2aW9yLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1hbmRPcHRpb25zIGV4dGVuZHMgQWthaXJvTW9kdWxlT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBDb21tYW5kIG5hbWVzLlxuXHQgKi9cblx0YWxpYXNlcz86IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBBcmd1bWVudCBvcHRpb25zIG9yIGdlbmVyYXRvci5cblx0ICovXG5cdGFyZ3M/OiBBcmd1bWVudE9wdGlvbnNbXSB8IEFyZ3VtZW50R2VuZXJhdG9yO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGVmYXVsdCBhcmd1bWVudCBvcHRpb25zLlxuXHQgKi9cblx0YXJndW1lbnREZWZhdWx0cz86IERlZmF1bHRBcmd1bWVudE9wdGlvbnM7XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIHJ1biBiZWZvcmUgYXJndW1lbnQgcGFyc2luZyBhbmQgZXhlY3V0aW9uLlxuXHQgKi9cblx0YmVmb3JlPzogQmVmb3JlQWN0aW9uO1xuXG5cdC8qKlxuXHQgKiBSZXN0cmljdHMgY2hhbm5lbCB0byBlaXRoZXIgJ2d1aWxkJyBvciAnZG0nLlxuXHQgKi9cblx0Y2hhbm5lbD86IFwiZ3VpbGRcIiB8IFwiZG1cIjtcblxuXHQvKipcblx0ICogUGVybWlzc2lvbnMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudCB0byBydW4gdGhpcyBjb21tYW5kLlxuXHQgKi9cblx0Y2xpZW50UGVybWlzc2lvbnM/OiBQZXJtaXNzaW9uUmVzb2x2YWJsZSB8IFBlcm1pc3Npb25SZXNvbHZhYmxlW10gfCBNaXNzaW5nUGVybWlzc2lvblN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBydW4gb24gbWVzc2FnZXMgdGhhdCBhcmUgbm90IGRpcmVjdGx5IGNvbW1hbmRzLlxuXHQgKi9cblx0Y29uZGl0aW9uPzogRXhlY3V0aW9uUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgY29tbWFuZCBjb29sZG93biBpbiBtaWxsaXNlY29uZHMuXG5cdCAqL1xuXHRjb29sZG93bj86IG51bWJlcjtcblxuXHQvKipcblx0ICogRGVzY3JpcHRpb24gb2YgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRkZXNjcmlwdGlvbj86IHN0cmluZyB8IGFueSB8IGFueVtdO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCBtZXNzYWdlIGVkaXRzIHdpbGwgcnVuIHRoaXMgY29tbWFuZC5cblx0ICovXG5cdGVkaXRhYmxlPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRmxhZ3MgdG8gdXNlIHdoZW4gdXNpbmcgYW4gQXJndW1lbnRHZW5lcmF0b3Jcblx0ICovXG5cdGZsYWdzPzogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIElEIG9mIHVzZXIocykgdG8gaWdub3JlIGNvb2xkb3duIG9yIGEgZnVuY3Rpb24gdG8gaWdub3JlLlxuXHQgKi9cblx0aWdub3JlQ29vbGRvd24/OiBTbm93Zmxha2UgfCBTbm93Zmxha2VbXSB8IElnbm9yZUNoZWNrUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBJRCBvZiB1c2VyKHMpIHRvIGlnbm9yZSBgdXNlclBlcm1pc3Npb25zYCBjaGVja3Mgb3IgYSBmdW5jdGlvbiB0byBpZ25vcmUuXG5cdCAqL1xuXHRpZ25vcmVQZXJtaXNzaW9ucz86IFNub3dmbGFrZSB8IFNub3dmbGFrZVtdIHwgSWdub3JlQ2hlY2tQcmVkaWNhdGU7XG5cblx0LyoqXG5cdCAqIFRoZSBrZXkgdHlwZSBvciBrZXkgZ2VuZXJhdG9yIGZvciB0aGUgbG9ja2VyLiBJZiBsb2NrIGlzIGEgc3RyaW5nLCBpdCdzIGV4cGVjdGVkIG9uZSBvZiAnZ3VpbGQnLCAnY2hhbm5lbCcsIG9yICd1c2VyJ1xuXHQgKi9cblx0bG9jaz86IEtleVN1cHBsaWVyIHwgXCJndWlsZFwiIHwgXCJjaGFubmVsXCIgfCBcInVzZXJcIjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gb25seSBhbGxvdyB0aGUgY29tbWFuZCB0byBiZSBydW4gaW4gTlNGVyBjaGFubmVscy5cblx0ICovXG5cdG9ubHlOc2Z3PzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogT3B0aW9uIGZsYWdzIHRvIHVzZSB3aGVuIHVzaW5nIGFuIEFyZ3VtZW50R2VuZXJhdG9yLlxuXHQgKi9cblx0b3B0aW9uRmxhZ3M/OiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgY2xpZW50IG93bmVyKHMpIG9ubHkuXG5cdCAqL1xuXHRvd25lck9ubHk/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUaGUgcHJlZml4KGVzKSB0byBvdmVyd3JpdGUgdGhlIGdsb2JhbCBvbmUgZm9yIHRoaXMgY29tbWFuZC5cblx0ICovXG5cdHByZWZpeD86IHN0cmluZyB8IHN0cmluZ1tdIHwgUHJlZml4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIGNvbnNpZGVyIHF1b3Rlcy5cblx0ICovXG5cdHF1b3RlZD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFtb3VudCBvZiBjb21tYW5kIHVzZXMgYWxsb3dlZCB1bnRpbCBjb29sZG93bi5cblx0ICovXG5cdHJhdGVsaW1pdD86IG51bWJlcjtcblxuXHQvKipcblx0ICogQSByZWdleCB0byBtYXRjaCBpbiBtZXNzYWdlcyB0aGF0IGFyZSBub3QgZGlyZWN0bHkgY29tbWFuZHMuIFRoZSBhcmdzIG9iamVjdCB3aWxsIGhhdmUgYG1hdGNoYCBhbmQgYG1hdGNoZXNgIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRyZWdleD86IFJlZ0V4cCB8IFJlZ2V4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIEN1c3RvbSBzZXBhcmF0b3IgZm9yIGFyZ3VtZW50IGlucHV0LlxuXHQgKi9cblx0c2VwYXJhdG9yPzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBNYXJrIGNvbW1hbmQgYXMgc2xhc2ggY29tbWFuZCBhbmQgc2V0IGluZm9ybWF0aW9uLlxuXHQgKi9cblx0c2xhc2g/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIHNsYXNoIGNvbW1hbmQgcmVzcG9uc2VzIGZvciB0aGlzIGNvbW1hbmQgc2hvdWxkIGJlIGVwaGVtZXJhbCBvciBub3QuXG5cdCAqL1xuXHRzbGFzaEVwaGVtZXJhbD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFzc2lnbiBzbGFzaCBjb21tYW5kcyB0byBTcGVjaWZpYyBndWlsZHMuIFRoaXMgb3B0aW9uIHdpbGwgbWFrZSB0aGUgY29tbWFuZHMgZG8gbm90IHJlZ2lzdGVyIGdsb2JhbGx5LCBidXQgb25seSB0byB0aGUgY2hvc2VuIHNlcnZlcnMuXG5cdCAqL1xuXHRzbGFzaEd1aWxkcz86IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBPcHRpb25zIGZvciB1c2luZyB0aGUgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHNsYXNoT3B0aW9ucz86IEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGFbXTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgY2xpZW50IHN1cGVyVXNlcnMocykgb25seS5cblx0ICovXG5cdHN1cGVyVXNlck9ubHk/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byB0eXBlIGluIGNoYW5uZWwgZHVyaW5nIGV4ZWN1dGlvbi5cblx0ICovXG5cdHR5cGluZz86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFBlcm1pc3Npb25zIHJlcXVpcmVkIGJ5IHRoZSB1c2VyIHRvIHJ1biB0aGlzIGNvbW1hbmQuXG5cdCAqL1xuXHR1c2VyUGVybWlzc2lvbnM/OiBQZXJtaXNzaW9uUmVzb2x2YWJsZSB8IFBlcm1pc3Npb25SZXNvbHZhYmxlW10gfCBNaXNzaW5nUGVybWlzc2lvblN1cHBsaWVyO1xufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdG8gcnVuIGJlZm9yZSBhcmd1bWVudCBwYXJzaW5nIGFuZCBleGVjdXRpb24uXG4gKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbW1hbmQuXG4gKi9cbmV4cG9ydCB0eXBlIEJlZm9yZUFjdGlvbiA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBhbnk7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB1c2VkIHRvIHN1cHBseSB0aGUga2V5IGZvciB0aGUgbG9ja2VyLlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjb21tYW5kLlxuICogQHBhcmFtIGFyZ3MgLSBFdmFsdWF0ZWQgYXJndW1lbnRzLlxuICovXG5leHBvcnQgdHlwZSBLZXlTdXBwbGllciA9IChtZXNzYWdlOiBNZXNzYWdlLCBhcmdzOiBhbnkpID0+IHN0cmluZztcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGNvbW1hbmQgc2hvdWxkIHJ1biBhcmJpdHJhcmlseS5cbiAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBjaGVjay5cbiAqL1xuZXhwb3J0IHR5cGUgRXhlY3V0aW9uUHJlZGljYXRlID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IGJvb2xlYW47XG5cbi8qKlxuICogQSBmdW5jdGlvbiB1c2VkIHRvIGNoZWNrIGlmIGEgbWVzc2FnZSBoYXMgcGVybWlzc2lvbnMgZm9yIHRoZSBjb21tYW5kLlxuICogQSBub24tbnVsbCByZXR1cm4gdmFsdWUgc2lnbmlmaWVzIHRoZSByZWFzb24gZm9yIG1pc3NpbmcgcGVybWlzc2lvbnMuXG4gKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbW1hbmQuXG4gKi9cbmV4cG9ydCB0eXBlIE1pc3NpbmdQZXJtaXNzaW9uU3VwcGxpZXIgPSAobWVzc2FnZTogTWVzc2FnZSkgPT4gUHJvbWlzZTxhbnk+IHwgYW55O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdXNlZCB0byByZXR1cm4gYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gZ2V0IHJlZ2V4IGZvci5cbiAqL1xuZXhwb3J0IHR5cGUgUmVnZXhTdXBwbGllciA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBSZWdFeHA7XG5cbi8qKlxuICogR2VuZXJhdG9yIGZvciBhcmd1bWVudHMuXG4gKiBXaGVuIHlpZWxkaW5nIGFyZ3VtZW50IG9wdGlvbnMsIHRoYXQgYXJndW1lbnQgaXMgcmFuIGFuZCB0aGUgcmVzdWx0IG9mIHRoZSBwcm9jZXNzaW5nIGlzIGdpdmVuLlxuICogVGhlIGxhc3QgdmFsdWUgd2hlbiB0aGUgZ2VuZXJhdG9yIGlzIGRvbmUgaXMgdGhlIHJlc3VsdGluZyBgYXJnc2AgZm9yIHRoZSBjb21tYW5kJ3MgYGV4ZWNgLlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjb21tYW5kLlxuICogQHBhcmFtIHBhcnNlZCAtIFBhcnNlZCBjb250ZW50LlxuICogQHBhcmFtIHN0YXRlIC0gQXJndW1lbnQgcHJvY2Vzc2luZyBzdGF0ZS5cbiAqL1xuZXhwb3J0IHR5cGUgQXJndW1lbnRHZW5lcmF0b3IgPSAoXG5cdG1lc3NhZ2U6IE1lc3NhZ2UsXG5cdHBhcnNlZDogQ29udGVudFBhcnNlclJlc3VsdCxcblx0c3RhdGU6IEFyZ3VtZW50UnVubmVyU3RhdGVcbikgPT4gSXRlcmFibGVJdGVyYXRvcjxBcmd1bWVudE9wdGlvbnMgfCBGbGFnPjtcbiJdfQ==